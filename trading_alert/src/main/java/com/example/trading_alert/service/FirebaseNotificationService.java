package com.example.trading_alert.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class FirebaseNotificationService {

    private FirebaseMessaging firebaseMessaging;

    public FirebaseNotificationService() {
        this.firebaseMessaging = null;
    }

    @Autowired(required = false)
    public void setFirebaseMessaging(@Nullable FirebaseMessaging firebaseMessaging) {
        this.firebaseMessaging = firebaseMessaging;
    }

    @Value("${app.notification.base-url:http://localhost:8081}")
    private String baseUrl;

    public boolean sendToToken(String token, String title, String body, Map<String, String> data) {
        if (firebaseMessaging == null || token == null || token.isBlank()) {
            return false;
        }

        try {
            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .putAllData(data == null ? Map.of() : data)
                    .build();

            String response = firebaseMessaging.send(message);
            log.info("FCM sent for token {} => {}", token, response);
            return true;
        } catch (FirebaseMessagingException exception) {
            log.warn("Failed to send FCM to token {}", token, exception);
            return false;
        }
    }

    public boolean sendToTokens(List<String> tokens, String title, String body, Map<String, String> data) {
        boolean sent = false;
        for (String token : tokens) {
            sent = sendToToken(token, title, body, data) || sent;
        }
        return sent;
    }
}
