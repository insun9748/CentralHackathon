package com.nausealab.deotlog.ai.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class OpenAiAnalysisResponse {

    private String aiSummary;

    private String triggerFactor;

    private String reliefFactor;

    private String nauseaType;

    private String symptomSummary;

    private String situationAnalysis;

    private String foodAnalysis;

    private String emotionAnalysis;
}