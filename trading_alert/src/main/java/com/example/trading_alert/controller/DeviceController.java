package com.example.trading_alert.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.trading_alert.dto.DeviceRegistrationRequest;
import com.example.trading_alert.entity.DeviceToken;
import com.example.trading_alert.service.DeviceTokenService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/device")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceTokenService deviceTokenService;

    @PostMapping("/register")
    public ResponseEntity<DeviceToken> register(@Valid @RequestBody DeviceRegistrationRequest request) {
        String userId = currentUserId();
        return ResponseEntity.ok(deviceTokenService.registerDevice(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<DeviceToken>> listDevices() {
        return ResponseEntity.ok(deviceTokenService.listDevices(currentUserId()));
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> deleteDevice(@RequestParam String token) {
        deviceTokenService.removeDevice(currentUserId(), token);
        return ResponseEntity.ok(Map.of("message", "Device removed"));
    }

    private String currentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Authentication required");
        }
        return authentication.getName();
    }
}
