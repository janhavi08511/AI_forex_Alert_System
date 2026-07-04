package com.example.trading_alert.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.trading_alert.dto.DeviceRegistrationRequest;
import com.example.trading_alert.entity.DeviceToken;
import com.example.trading_alert.entity.User;
import com.example.trading_alert.repository.DeviceTokenRepository;
import com.example.trading_alert.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeviceTokenService {

    private final DeviceTokenRepository deviceTokenRepository;
    private final UserRepository userRepository;

    public DeviceToken registerDevice(String userIdentifier, DeviceRegistrationRequest request) {
        String resolvedUserId = resolveUserId(userIdentifier);
        Optional<DeviceToken> existing = deviceTokenRepository.findByToken(request.getToken());
        if (existing.isPresent()) {
            DeviceToken deviceToken = existing.get();
            deviceToken.setUserId(resolvedUserId);
            deviceToken.setPlatform(request.getPlatform());
            deviceToken.setActive(true);
            deviceToken.setLastSeenAt(Instant.now());
            return deviceTokenRepository.save(deviceToken);
        }

        DeviceToken deviceToken = DeviceToken.builder()
                .userId(resolvedUserId)
                .token(request.getToken())
                .platform(request.getPlatform())
                .createdAt(Instant.now())
                .lastSeenAt(Instant.now())
                .active(true)
                .build();
        return deviceTokenRepository.save(deviceToken);
    }

    public List<DeviceToken> listDevices(String userId) {
        String resolvedUserId = resolveUserId(userId);
        return deviceTokenRepository.findAllByUserIdAndActiveTrue(resolvedUserId);
    }

    public void removeDevice(String userId, String token) {
        String resolvedUserId = resolveUserId(userId);
        Optional<DeviceToken> deviceToken = deviceTokenRepository.findByToken(token);
        if (deviceToken.isPresent() && deviceToken.get().getUserId() != null && deviceToken.get().getUserId().equals(resolvedUserId)) {
            deviceTokenRepository.delete(deviceToken.get());
        }
    }

    public List<DeviceToken> findActiveTokensForUser(String userId) {
        String resolvedUserId = resolveUserId(userId);
        return deviceTokenRepository.findAllByUserIdAndActiveTrue(resolvedUserId);
    }

    private String resolveUserId(String userIdentifier) {
        if (userIdentifier == null || userIdentifier.isBlank()) {
            return null;
        }

        Optional<User> byId = userRepository.findById(userIdentifier);
        if (byId.isPresent()) {
            return byId.get().getId();
        }

        return userRepository.findByEmail(userIdentifier)
                .map(User::getId)
                .orElse(userIdentifier);
    }
}
