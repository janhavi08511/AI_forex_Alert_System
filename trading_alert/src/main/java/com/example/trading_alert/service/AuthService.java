package com.example.trading_alert.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.trading_alert.dto.LoginRequest;
import com.example.trading_alert.dto.LoginResponse;
import com.example.trading_alert.dto.RegisterRequest;
import com.example.trading_alert.entity.User;
import com.example.trading_alert.repository.UserRepository;
import com.example.trading_alert.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder encoder;

    private final JwtUtil jwtUtil;

    public String register(RegisterRequest request){

        if(userRepository.findByEmail(request.getEmail())
                .isPresent()){

            return "User already exists";
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        encoder.encode(
                                request.getPassword()
                        )
                )
                .role("USER")
                .build();

        userRepository.save(user);

        return "User Registered Successfully";
    }

    public LoginResponse login(LoginRequest request){

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Credentials"));

        boolean matched = encoder.matches(request.getPassword(), user.getPassword());

        if (!matched) {
            throw new RuntimeException("Invalid Credentials");
        }

        String token =
                jwtUtil.generateToken(
                        user.getEmail()
                );

        return new LoginResponse(token);
    }
}