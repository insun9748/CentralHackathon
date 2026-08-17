package com.nausealab.deotlog.report.controller;

import com.nausealab.deotlog.global.response.ApiResponse;
import com.nausealab.deotlog.global.security.CustomUserDetails;
import com.nausealab.deotlog.report.dto.response.ReportResponse;
import com.nausealab.deotlog.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    /**
     * 기간별 입덧 리포트 조회
     */
    @GetMapping
    public ApiResponse<ReportResponse> getReport(
            @AuthenticationPrincipal CustomUserDetails userDetails,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {

        ReportResponse response =
                reportService.getReport(
                        userDetails.getUserId(),
                        startDate,
                        endDate
                );

        return ApiResponse.success(
                "리포트 조회 성공",
                response
        );
    }
}