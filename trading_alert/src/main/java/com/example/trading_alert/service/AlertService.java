package com.example.trading_alert.service;

import com.example.trading_alert.dto.CreateAlertRequest;
import com.example.trading_alert.entity.Alert;
import com.example.trading_alert.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    public Alert createAlert(
            CreateAlertRequest request){

        Alert alert = Alert.builder()
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

}
