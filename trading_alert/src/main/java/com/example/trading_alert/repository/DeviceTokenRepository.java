package com.example.trading_alert.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.trading_alert.entity.DeviceToken;

@Repository
public interface DeviceTokenRepository extends MongoRepository<DeviceToken, String> {
    Optional<DeviceToken> findByToken(String token);
    List<DeviceToken> findAllByUserIdAndActiveTrue(String userId);
    void deleteByToken(String token);
}
