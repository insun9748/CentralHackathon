package com.nausealab.deotlog.report.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TimeCategoryAnalysisResponse {

    private Long timeCategoryId;

    private String timeCategory;

    private double averageIntensity;

    private int recordCount;

    private String mainTriggerFactor;
}