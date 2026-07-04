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
@Document(collection = "device_tokens")
public class DeviceToken {

    @Id
    private String id;
    private String userId;
    private String token;
    private String platform;
    private Instant createdAt;
    private Instant lastSeenAt;
    private boolean active;
}
