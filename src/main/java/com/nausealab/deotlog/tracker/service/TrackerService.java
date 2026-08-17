package com.nausealab.deotlog.tracker.service;

import com.nausealab.deotlog.tracker.dto.response.CalendarResponse;
import com.nausealab.deotlog.tracker.dto.response.TrackerResponse;

public interface TrackerService {

    TrackerResponse getTracker(Long userId);

    CalendarResponse getCalendar(
            Long userId,
            int year,
            int month
    );
}