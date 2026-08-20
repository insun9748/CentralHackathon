package com.nausealab.deotlog.record.dto.response;

import com.nausealab.deotlog.category.dto.response.IntensityResponse;
import com.nausealab.deotlog.category.dto.response.TimeCategoryResponse;
import com.nausealab.deotlog.record.entity.RecordStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RecordResponse {

    private Long recordId;

    private LocalDateTime recordDateTime;

    private TimeCategoryResponse timeCategory;

    private IntensityResponse intensity;

    private String memo;

    private RecordStatus status;

    private String aiSummary;

    private String triggerFactor;

    private String symptomSummary;
}