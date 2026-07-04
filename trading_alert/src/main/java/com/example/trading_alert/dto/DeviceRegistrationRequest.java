package com.example.trading_alert.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeviceRegistrationRequest {
    @NotBlank
    private String token;

    private String platform;
}
