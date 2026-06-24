package com.example.trading_alert.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.trading_alert.entity.Alert;

public interface AlertRepository
        extends MongoRepository<Alert,String> {

    List<Alert> findByUserId(String userId);

    List<Alert> findByStatus(String status);

    List<Alert> findByStatusAndTriggeredFalse(String status);
}