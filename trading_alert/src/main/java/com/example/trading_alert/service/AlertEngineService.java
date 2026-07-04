package com.example.trading_alert.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.OptionalDouble;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.trading_alert.entity.Alert;
import com.example.trading_alert.repository.AlertRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AlertEngineService {

    private final AlertRepository alertRepository;
    private final PriceSnapshotService priceSnapshotService;
    private final MarketWebSocketHandler marketWebSocketHandler;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public AlertEngineService(AlertRepository alertRepository,
                              PriceSnapshotService priceSnapshotService,
                              MarketWebSocketHandler marketWebSocketHandler,
                              NotificationService notificationService) {
        this.alertRepository = alertRepository;
        this.priceSnapshotService = priceSnapshotService;
        this.marketWebSocketHandler = marketWebSocketHandler;
        this.notificationService = notificationService;
    }

    public AlertEngineService(AlertRepository alertRepository,
                              PriceSnapshotService priceSnapshotService,
                              MarketWebSocketHandler marketWebSocketHandler) {
        this(alertRepository, priceSnapshotService, marketWebSocketHandler, null);
    }

    @Scheduled(fixedRate = 10000)
    public void checkAlerts() {
        LocalDateTime now = LocalDateTime.now();

        reactivateExpiredSnoozes(now);

        List<Alert> alerts = alertRepository.findByStatusAndTriggeredFalse("ACTIVE");
        for (Alert alert : alerts) {
            if (Boolean.TRUE.equals(alert.isTriggered()) || !"ACTIVE".equals(alert.getStatus())) {
                continue;
            }

            OptionalDouble currentPrice = priceSnapshotService.getPrice(normalizePair(alert.getPair()));
            if (currentPrice.isEmpty()) {
                continue;
            }

            if (shouldTrigger(alert, currentPrice.getAsDouble())) {
                triggerAlert(alert, now);
            }
        }
    }

    public void triggerAlert(Alert alert, LocalDateTime now) {
        alert.setTriggered(true);
        alert.setStatus("TRIGGERED");
        alert.setTriggeredAt(now);
        alert.setUpdatedAt(now);
        alertRepository.save(alert);
        if (notificationService != null) {
            notificationService.sendAlertNotification(alert);
        }
        broadcastTrigger(alert);
    }

    public void dismissAlert(Alert alert, LocalDateTime now) {
        alert.setStatus("DISMISSED");
        alert.setUpdatedAt(now);
        alertRepository.save(alert);
    }

    public void snoozeAlert(Alert alert, LocalDateTime snoozedUntil, LocalDateTime now) {
        alert.setStatus("SNOOZED");
        alert.setSnoozedUntil(snoozedUntil);
        alert.setUpdatedAt(now);
        alertRepository.save(alert);
    }

    private void reactivateExpiredSnoozes(LocalDateTime now) {
        List<Alert> snoozedAlerts = alertRepository.findByStatus("SNOOZED");
        for (Alert alert : snoozedAlerts) {
            if (alert.getSnoozedUntil() != null && !now.isBefore(alert.getSnoozedUntil())) {
                alert.setStatus("ACTIVE");
                alert.setSnoozedUntil(null);
                alert.setUpdatedAt(now);
                alertRepository.save(alert);
            }
        }
    }

    private boolean shouldTrigger(Alert alert, double currentPrice) {
        if (alert == null || alert.getTargetPrice() == null) {
            return false;
        }

        String condition = alert.getCondition() == null ? "" : alert.getCondition().trim().toUpperCase();
        BigDecimal current = BigDecimal.valueOf(currentPrice);
        BigDecimal target = BigDecimal.valueOf(alert.getTargetPrice());
        BigDecimal pointSize = getPointSize(alert.getPair(), target);

        return switch (condition) {
            case "TOUCH" -> current.compareTo(target) == 0;
            case "ABOVE" -> current.compareTo(target.add(pointSize)) >= 0;
            case "BELOW" -> current.compareTo(target.subtract(pointSize)) <= 0;
            default -> current.compareTo(target) == 0;
        };
    }

    private BigDecimal getPointSize(String pair, BigDecimal target) {
        String normalizedPair = pair == null ? "" : pair.toUpperCase();
        if (normalizedPair.contains("XAU") || normalizedPair.contains("GOLD")) {
            return BigDecimal.ONE;
        }
        return BigDecimal.valueOf(Math.max(0.0001, Math.abs(target.doubleValue()) * 0.0001));
    }

    private String normalizePair(String pair) {
        if (pair == null) {
            return "";
        }
        return pair.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
    }

    private void broadcastTrigger(Alert alert) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "ALERT_TRIGGERED");
        payload.put("alertId", alert.getId());
        payload.put("pair", alert.getPair());
        payload.put("targetPrice", alert.getTargetPrice());
        payload.put("status", alert.getStatus());
        payload.put("triggeredAt", alert.getTriggeredAt());

        try {
            marketWebSocketHandler.broadcast(objectMapper.writeValueAsString(payload));
        } catch (JsonProcessingException ignored) {
            // Ignore websocket serialization issues and preserve alert state.
        }
    }
}