package com.nausealab.deotlog.report.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class ReportResponse {

    // 분석 기간
    private LocalDate startDate;
    private LocalDate endDate;

    // 전체 기록 수
    private int totalRecords;

    // 시간대별 입덧 분석
    private List<TimeCategoryAnalysisResponse> timeCategoryAnalysis;

    // 반복적으로 나타나는 주요 유발 요인
    private List<TriggerFactorResponse> triggerFactors;

    // 완화 요인 / 경험
    private List<ReliefFactorResponse> reliefFactors;

    // AI 개인별 입덧 경향
    private String aiTrend;

    // AI 개인 맞춤 입덧 관리 방향
    private String aiManagementGuide;
}