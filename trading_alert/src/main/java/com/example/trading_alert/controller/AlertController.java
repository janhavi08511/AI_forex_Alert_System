package com.example.trading_alert.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.trading_alert.dto.CreateAlertRequest;
import com.example.trading_alert.entity.Alert;
import com.example.trading_alert.service.AlertService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    @PostMapping
    public Alert createAlert(
            @RequestBody CreateAlertRequest request) {

        return alertService.createAlert(request);
    }

    @GetMapping
    public List<Alert> getAllAlerts() {

        return alertService.getAllAlerts();
    }
}