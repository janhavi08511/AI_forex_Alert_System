package com.example.trading_alert.entity;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notification_history")
public class NotificationHistory {

    @Id
    private String id;
    private String userId;
    private String title;
    private String body;
    private String type;
    private String alertId;
    private String pair;
    private String price;
    private String status;
    private Instant sentAt;
    private Instant openedAt;
}
