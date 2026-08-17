package com.nausealab.deotlog.record.dto.request;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class RecordUpdateRequest {
    // ===== 기록 수정 =====

    private Long timeCategoryId;

    private Long intensityId;

    private LocalDateTime recordDateTime;

    private String memo;

    // ===== AI 분석 수정 =====

    private String aiSummary;

    private String triggerFactor;

    private String reliefFactor;

    private String nauseaType;

    private String symptomSummary;

    private String situationAnalysis;

    private String foodAnalysis;

    private String emotionAnalysis;

}