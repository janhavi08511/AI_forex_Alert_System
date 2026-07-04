package com.example.trading_alert.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private String id;
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
