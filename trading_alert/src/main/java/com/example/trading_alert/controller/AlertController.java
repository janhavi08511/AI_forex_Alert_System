package com.example.trading_alert.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.trading_alert.dto.CreateAlertRequest;
import com.example.trading_alert.entity.Alert;
import com.example.trading_alert.repository.AlertRepository;
import com.example.trading_alert.service.AlertEngineService;
import com.example.trading_alert.service.AlertService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;
    private final AlertEngineService alertEngineService;
    private final AlertRepository alertRepository;

    @PostMapping
    public Alert createAlert(
            @RequestBody CreateAlertRequest request) {

        return alertService.createAlert(request);
    }

    @GetMapping
    public List<Alert> getAllAlerts() {

        return alertService.getAllAlerts();
    }

    @PatchMapping("/{id}/dismiss")
    public Alert dismissAlert(@PathVariable String id) {
        Alert alert = alertRepository.findById(id).orElseThrow();
        alertEngineService.dismissAlert(alert, LocalDateTime.now());
        return alert;
    }

    @PatchMapping("/{id}/snooze")
    public Alert snoozeAlert(@PathVariable String id) {
        Alert alert = alertRepository.findById(id).orElseThrow();
        alertEngineService.snoozeAlert(alert, LocalDateTime.now().plusMinutes(5), LocalDateTime.now());
        return alert;
    }

    @PatchMapping("/{id}/resume")
    public Alert resumeAlert(@PathVariable String id) {
        Alert alert = alertRepository.findById(id).orElseThrow();
        alert.setStatus("ACTIVE");
        alert.setSnoozedUntil(null);
        alert.setUpdatedAt(LocalDateTime.now());
        return alertRepository.save(alert);
    }
}