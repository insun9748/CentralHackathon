package com.nausealab.deotlog.user.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
public class PregnancyWeekCalculator {

    /**
     * 출산 예정일 기준 현재 임신 주차 계산
     */
    public int calculate(LocalDate dueDate) {

        LocalDate today = LocalDate.now();

        LocalDate pregnancyStart = dueDate.minusWeeks(40);

        long days = ChronoUnit.DAYS.between(
                pregnancyStart,
                today
        );

        int week = (int) (days / 7);

        if (week < 1) {
            return 1;
        }

        if (week > 40) {
            return 40;
        }

        return week;
    }
}