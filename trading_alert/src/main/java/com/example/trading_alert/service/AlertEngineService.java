package com.example.trading_alert.service;

import com.example.trading_alert.entity.Alert;
import com.example.trading_alert.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertEngineService {

    private final AlertRepository alertRepository;

    @Scheduled(fixedRate = 10000)
    public void checkAlerts(){

        List<Alert> alerts =
                alertRepository.findByStatus(
                        "ACTIVE"
                );

        for(Alert alert : alerts){

            double currentPrice = 3405;

            if(alert.getCondition()
                    .equals("ABOVE")){

                if(currentPrice >=
                        alert.getTargetPrice()){

                    alert.setTriggered(true);

                    alert.setStatus(
                            "TRIGGERED"
                    );

                    alertRepository.save(
                            alert
                    );

                    System.out.println(
                            "ALERT TRIGGERED"
                    );
                }
            }
        }
    }
}