package com.example.trading_alert.service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.trading_alert.entity.Alert;
import com.example.trading_alert.entity.NotificationHistory;
import com.example.trading_alert.entity.User;
import com.example.trading_alert.repository.NotificationHistoryRepository;
import com.example.trading_alert.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final DeviceTokenService deviceTokenService;
    private final FirebaseNotificationService firebaseNotificationService;
    private final NotificationHistoryRepository notificationHistoryRepository;
    private final UserRepository userRepository;

    public boolean sendAlertNotification(Alert alert) {
        if (alert == null) {
            return false;
        }

        Optional<User> optionalUser = resolveUser(alert.getUserId());
        if (optionalUser.isEmpty()) {
            log.warn("Skipping alert notification because user {} was not found", alert.getUserId());
            return false;
        }

        String title = "Alert triggered";
        String body = String.format("%s hit %s", alert.getPair(), alert.getTargetPrice());
        Map<String, String> data = new HashMap<>();
        data.put("type", "alert");
        data.put("alertId", alert.getId() == null ? "" : alert.getId());
        data.put("pair", alert.getPair() == null ? "" : alert.getPair());
        data.put("price", alert.getTargetPrice() == null ? "" : String.valueOf(alert.getTargetPrice()));

        List<String> tokens = deviceTokenService.findActiveTokensForUser(optionalUser.get().getId())
                .stream()
                .map(device -> device.getToken())
                .filter(token -> token != null && !token.isBlank())
                .toList();

        boolean sent = firebaseNotificationService.sendToTokens(tokens, title, body, data);
        saveHistory(optionalUser.get(), title, body, "alert", alert.getId(), alert.getPair(), alert.getTargetPrice() == null ? null : alert.getTargetPrice().toString(), sent ? "SENT" : "FAILED");
        return sent;
    }

    public boolean sendTestNotification(String userId, String title, String body) {
        if (userId == null) {
            return false;
        }

        List<String> tokens = deviceTokenService.findActiveTokensForUser(userId)
                .stream()
                .map(device -> device.getToken())
                .filter(token -> token != null && !token.isBlank())
                .toList();

        boolean sent = firebaseNotificationService.sendToTokens(tokens, title, body, Map.of("type", "system"));
        Optional<User> optionalUser = resolveUser(userId);
        if (optionalUser.isPresent()) {
            saveHistory(optionalUser.get(), title, body, "system", null, null, null, sent ? "SENT" : "FAILED");
        }
        return sent;
    }

    public List<NotificationHistory> getHistory(String userId) {
        return resolveUser(userId)
                .map(user -> notificationHistoryRepository.findAllByUserIdOrderBySentAtDesc(user.getId()))
                .orElseGet(List::of);
    }

    private Optional<User> resolveUser(String userIdentifier) {
        if (userIdentifier == null || userIdentifier.isBlank()) {
            return Optional.empty();
        }

        Optional<User> byId = userRepository.findById(userIdentifier);
        if (byId.isPresent()) {
            return byId;
        }

        return userRepository.findByEmail(userIdentifier);
    }

    private void saveHistory(User user, String title, String body, String type, String alertId, String pair, String price, String status) {
        NotificationHistory entry = NotificationHistory.builder()
                .userId(user.getId())
                .title(title)
                .body(body)
                .type(type)
                .alertId(alertId)
                .pair(pair)
                .price(price)
                .status(status)
                .sentAt(Instant.now())
                .build();
        notificationHistoryRepository.save(entry);
    }
}
