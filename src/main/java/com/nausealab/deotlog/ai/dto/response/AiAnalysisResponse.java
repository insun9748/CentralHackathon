package com.nausealab.deotlog.ai.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AiAnalysisResponse {

    private Long aiAnalysisId;

    private Long recordId;

    private String aiSummary;

    private String triggerFactor;

    private String reliefFactor;

    private String nauseaType;

    private String symptomSummary;

    private String situationAnalysis;

    private String foodAnalysis;

    private String emotionAnalysis;

    private String modelName;

    private String promptVersion;
}