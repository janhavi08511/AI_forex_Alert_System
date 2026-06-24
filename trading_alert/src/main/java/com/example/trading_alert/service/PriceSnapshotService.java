package com.example.trading_alert.service;

import java.util.OptionalDouble;

import org.springframework.stereotype.Service;

@Service
public class PriceSnapshotService {

    public OptionalDouble getPrice(String pair) {
        String configuredPrice = System.getProperty("alert.price." + pair, System.getenv("ALERT_PRICE_" + pair));
        if (configuredPrice == null || configuredPrice.isBlank()) {
            return OptionalDouble.empty();
        }

        try {
            return OptionalDouble.of(Double.parseDouble(configuredPrice));
        } catch (NumberFormatException ex) {
            return OptionalDouble.empty();
        }
    }
}
