package com.example.trading_alert.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.trading_alert.dto.NotificationResponse;
import com.example.trading_alert.entity.NotificationHistory;
import com.example.trading_alert.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getHistory() {
        return ResponseEntity.ok(notificationService.getHistory(currentUserId()).stream()
                .map(this::toResponse)
                .toList());
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> sendTest(@RequestBody Map<String, String> body) {
        String title = body.getOrDefault("title", "Test notification");
        String message = body.getOrDefault("body", "This is a test notification from TradeAlert AI");
        boolean sent = notificationService.sendTestNotification(currentUserId(), title, message);
        return ResponseEntity.ok(Map.of("message", sent ? "Notification sent" : "No devices available"));
    }

    private String currentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Authentication required");
        }
        return authentication.getName();
    }

    private NotificationResponse toResponse(NotificationHistory history) {
        return NotificationResponse.builder()
                .id(history.getId())
                .title(history.getTitle())
                .body(history.getBody())
                .type(history.getType())
                .alertId(history.getAlertId())
                .pair(history.getPair())
                .price(history.getPrice())
                .status(history.getStatus())
                .sentAt(history.getSentAt())
                .openedAt(history.getOpenedAt())
                .build();
    }
}
