package com.example.trading_alert;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class TradingAlertApplication {

	public static void main(String[] args) {
		SpringApplication.run(TradingAlertApplication.class, args);
	}

}
