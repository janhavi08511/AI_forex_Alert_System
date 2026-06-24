package com.example.trading_alert.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {

    @Id
    private String id;

    private String userId;

    private String pair;

    private Double targetPrice;

    private String condition;

    private String status;
    private boolean triggered;
    @Version
    private Long version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime triggeredAt;
    private LocalDateTime snoozedUntil;
}