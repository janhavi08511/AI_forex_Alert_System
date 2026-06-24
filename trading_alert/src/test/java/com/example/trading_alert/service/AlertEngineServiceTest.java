package com.example.trading_alert.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.OptionalDouble;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mockito;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.trading_alert.entity.Alert;
import com.example.trading_alert.repository.AlertRepository;

class AlertEngineServiceTest {

    @Test
    void triggersWhenPriceMatchesTargetExactly() {
        AlertRepository alertRepository = Mockito.mock(AlertRepository.class);
        PriceSnapshotService priceSnapshotService = Mockito.mock(PriceSnapshotService.class);
        AlertEngineService alertEngineService = new AlertEngineService(alertRepository, priceSnapshotService, Mockito.mock(MarketWebSocketHandler.class));
        Alert alert = Alert.builder()
                .id("a1")
                .pair("XAUUSD")
                .targetPrice(3400.0)
                .condition("TOUCH")
                .status("ACTIVE")
                .triggered(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(alertRepository.findByStatusAndTriggeredFalse("ACTIVE")).thenReturn(List.of(alert));
        when(priceSnapshotService.getPrice("XAUUSD")).thenReturn(OptionalDouble.of(3400.0));

        alertEngineService.checkAlerts();

        ArgumentCaptor<Alert> alertCaptor = ArgumentCaptor.forClass(Alert.class);
        verify(alertRepository).save(alertCaptor.capture());
        Alert saved = alertCaptor.getValue();
        assertEquals("TRIGGERED", saved.getStatus());
        assertTrue(saved.isTriggered());
    }

    @Test
    void doesNotTriggerWhenPriceIsNotExactlyEqual() {
        AlertRepository alertRepository = Mockito.mock(AlertRepository.class);
        PriceSnapshotService priceSnapshotService = Mockito.mock(PriceSnapshotService.class);
        AlertEngineService alertEngineService = new AlertEngineService(alertRepository, priceSnapshotService, Mockito.mock(MarketWebSocketHandler.class));

        Alert alert = Alert.builder()
                .id("a2")
                .pair("XAUUSD")
                .targetPrice(3400.0)
                .condition("TOUCH")
                .status("ACTIVE")
                .triggered(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(alertRepository.findByStatusAndTriggeredFalse("ACTIVE")).thenReturn(List.of(alert));
        when(priceSnapshotService.getPrice("XAUUSD")).thenReturn(OptionalDouble.of(3399.95));

        alertEngineService.checkAlerts();

        verify(alertRepository, times(0)).save(any(Alert.class));
        assertFalse(alert.isTriggered());
        assertEquals("ACTIVE", alert.getStatus());
    }

    @Test
    void triggersAboveAlertWhenPriceIsOnePointAboveTarget() {
        AlertRepository alertRepository = Mockito.mock(AlertRepository.class);
        PriceSnapshotService priceSnapshotService = Mockito.mock(PriceSnapshotService.class);
        AlertEngineService alertEngineService = new AlertEngineService(alertRepository, priceSnapshotService, Mockito.mock(MarketWebSocketHandler.class));

        Alert alert = Alert.builder()
                .id("a3")
                .pair("XAUUSD")
                .targetPrice(3400.0)
                .condition("ABOVE")
                .status("ACTIVE")
                .triggered(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(alertRepository.findByStatusAndTriggeredFalse("ACTIVE")).thenReturn(List.of(alert));
        when(priceSnapshotService.getPrice("XAUUSD")).thenReturn(OptionalDouble.of(3401.0));

        alertEngineService.checkAlerts();

        ArgumentCaptor<Alert> alertCaptor = ArgumentCaptor.forClass(Alert.class);
        verify(alertRepository).save(alertCaptor.capture());
        Alert saved = alertCaptor.getValue();
        assertEquals("TRIGGERED", saved.getStatus());
        assertTrue(saved.isTriggered());
    }

    @Test
    void doesNotTriggerAboveAlertBeforeOnePointThreshold() {
        AlertRepository alertRepository = Mockito.mock(AlertRepository.class);
        PriceSnapshotService priceSnapshotService = Mockito.mock(PriceSnapshotService.class);
        AlertEngineService alertEngineService = new AlertEngineService(alertRepository, priceSnapshotService, Mockito.mock(MarketWebSocketHandler.class));

        Alert alert = Alert.builder()
                .id("a4")
                .pair("XAUUSD")
                .targetPrice(3400.0)
                .condition("ABOVE")
                .status("ACTIVE")
                .triggered(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(alertRepository.findByStatusAndTriggeredFalse("ACTIVE")).thenReturn(List.of(alert));
        when(priceSnapshotService.getPrice("XAUUSD")).thenReturn(OptionalDouble.of(3400.5));

        alertEngineService.checkAlerts();

        verify(alertRepository, times(0)).save(any(Alert.class));
        assertFalse(alert.isTriggered());
        assertEquals("ACTIVE", alert.getStatus());
    }

    @Test
    void triggersBelowAlertWhenPriceIsOnePointBelowTarget() {
        AlertRepository alertRepository = Mockito.mock(AlertRepository.class);
        PriceSnapshotService priceSnapshotService = Mockito.mock(PriceSnapshotService.class);
        AlertEngineService alertEngineService = new AlertEngineService(alertRepository, priceSnapshotService, Mockito.mock(MarketWebSocketHandler.class));

        Alert alert = Alert.builder()
                .id("a5")
                .pair("XAUUSD")
                .targetPrice(3400.0)
                .condition("BELOW")
                .status("ACTIVE")
                .triggered(false)
                .createdAt(LocalDateTime.now())
                .build();

        when(alertRepository.findByStatusAndTriggeredFalse("ACTIVE")).thenReturn(List.of(alert));
        when(priceSnapshotService.getPrice("XAUUSD")).thenReturn(OptionalDouble.of(3399.0));

        alertEngineService.checkAlerts();

        ArgumentCaptor<Alert> alertCaptor = ArgumentCaptor.forClass(Alert.class);
        verify(alertRepository).save(alertCaptor.capture());
        Alert saved = alertCaptor.getValue();
        assertEquals("TRIGGERED", saved.getStatus());
        assertTrue(saved.isTriggered());
    }

}
