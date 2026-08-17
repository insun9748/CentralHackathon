package com.nausealab.deotlog.tracker.controller;

import com.nausealab.deotlog.global.response.ApiResponse;
import com.nausealab.deotlog.global.security.CustomUserDetails;
import com.nausealab.deotlog.tracker.dto.response.CalendarResponse;
import com.nausealab.deotlog.tracker.dto.response.TrackerResponse;
import com.nausealab.deotlog.tracker.service.TrackerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tracker")
public class TrackerController {

    private final TrackerService trackerService;

    @GetMapping
    public ApiResponse<TrackerResponse> getTracker(

            @AuthenticationPrincipal
            CustomUserDetails userDetails
    ) {

        TrackerResponse response =
                trackerService.getTracker(
                        userDetails.getUserId()
                );

        return ApiResponse.success(
                "임신 주차 조회 성공",
                response
        );
    }

    @GetMapping("/calendar")
    public ApiResponse<CalendarResponse> getCalendar(

            @AuthenticationPrincipal
            CustomUserDetails userDetails,

            @RequestParam int year,

            @RequestParam int month
    ) {

        CalendarResponse response =
                trackerService.getCalendar(
                        userDetails.getUserId(),
                        year,
                        month
                );

        return ApiResponse.success(
                "캘린더 조회 성공",
                response
        );
    }

}