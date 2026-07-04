package com.example.trading_alert.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.service-account.path:}")
    private String serviceAccountPath;

    @PostConstruct
    public void initializeFirebase() {
        if (!FirebaseApp.getApps().isEmpty()) {
            log.info("Firebase already initialized");
            return;
        }

        try {
            if (serviceAccountPath != null && !serviceAccountPath.isBlank()) {
                try (InputStream serviceAccountStream = new FileInputStream(serviceAccountPath)) {
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
                            .build();

                    FirebaseApp.initializeApp(options);
                    log.info("Firebase initialized successfully from {}", serviceAccountPath);
                    return;
                }
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .build();
            FirebaseApp.initializeApp(options);
            log.info("Firebase initialized successfully using application default credentials");
        } catch (Exception exception) {
            log.warn("Firebase service account not available; push notifications will be disabled", exception);
        }
    }

    @Bean
    public FirebaseMessaging firebaseMessaging() {
        if (FirebaseApp.getApps().isEmpty()) {
            return null;
        }
        return FirebaseMessaging.getInstance();
    }
}
