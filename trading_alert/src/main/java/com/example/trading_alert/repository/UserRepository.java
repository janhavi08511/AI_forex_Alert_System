package com.example.trading_alert.repository;

import com.example.trading_alert.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository
        extends MongoRepository<User,String> {

    Optional<User> findByEmail(String email);
}