package com.nausealab.deotlog.report.service;

import com.nausealab.deotlog.report.dto.response.ReportResponse;

import java.time.LocalDate;

public interface ReportService {

    ReportResponse getReport(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );
}