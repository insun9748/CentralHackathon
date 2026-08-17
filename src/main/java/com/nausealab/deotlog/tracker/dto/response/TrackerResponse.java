package com.nausealab.deotlog.tracker.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TrackerResponse {

    // 현재 계산된 임신 주차
    private Integer currentWeek;

    // 임신 초기 / 중기 / 후기
    private String stage;

    // 식생활 주의사항
    private String caution;

    // 영양관리
    private String foodInfo;

    // 몸의 변화
    private String bodyChange;
}