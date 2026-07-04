package com.example.trading_alert.service;

import com.example.trading_alert.dto.CreateAlertRequest;
import com.example.trading_alert.entity.Alert;
import com.example.trading_alert.repository.AlertRepository;
import com.example.trading_alert.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;

    public Alert createAlert(
            CreateAlertRequest request, String userIdentifier){

        String resolvedUserId = resolveUserId(userIdentifier);

        Alert alert = Alert.builder()
                .userId(resolvedUserId)
                .pair(request.getPair())
                .targetPrice(
                        request.getTargetPrice()
                )
                .condition(
                        request.getCondition()
                )
                .status("ACTIVE")
                .triggered(false)
                .createdAt(LocalDateTime.now())
                .build();

        return alertRepository.save(alert);
    }
    public List<Alert> getAllAlerts(){
        return alertRepository.findAll();
    }

    private String resolveUserId(String userIdentifier) {
        if (userIdentifier == null || userIdentifier.isBlank()) {
            return null;
        }

        return userRepository.findById(userIdentifier)
                .map(user -> user.getId())
                .orElseGet(() -> userRepository.findByEmail(userIdentifier)
                        .map(user -> user.getId())
                        .orElse(userIdentifier));
    }

}
