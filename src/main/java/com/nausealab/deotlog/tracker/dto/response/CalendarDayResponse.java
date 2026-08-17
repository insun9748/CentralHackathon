package com.nausealab.deotlog.tracker.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class CalendarDayResponse {

    private LocalDate date;

    private boolean hasRecord;

    private Double averageIntensity;
}