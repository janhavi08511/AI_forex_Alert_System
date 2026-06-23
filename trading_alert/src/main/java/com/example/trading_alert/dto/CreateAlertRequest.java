package com.example.trading_alert.dto;

import lombok.Data;

@Data
public class CreateAlertRequest {

    private String pair;

    private Double targetPrice;

    private String condition;
}