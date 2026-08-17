package com.nausealab.deotlog.record.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class RecordCreateRequest {

    @NotNull
    private Long timeCategoryId;

    @NotNull
    private Long intensityId;

    @NotNull
    private LocalDateTime recordDateTime;

    private String memo;

}