package com.example.trading_alert.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.trading_alert.entity.NotificationHistory;

@Repository
public interface NotificationHistoryRepository extends MongoRepository<NotificationHistory, String> {
    List<NotificationHistory> findAllByUserIdOrderBySentAtDesc(String userId);
}
