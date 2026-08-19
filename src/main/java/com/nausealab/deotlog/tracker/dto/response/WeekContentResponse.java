package com.nausealab.deotlog.tracker.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WeekContentResponse {

    // 항목 제목
    private String title;

    // 설명
    private String description;

    // 강조 문구 (없으면 null)
    private String highlight;
}