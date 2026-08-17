package com.nausealab.deotlog.tracker.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CalendarResponse {

    private Integer year;

    private Integer month;

    private List<CalendarDayResponse> days;
}