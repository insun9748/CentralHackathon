package com.nausealab.deotlog.tracker.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class TrackerResponse {

    // 현재 임신 주차
    private Integer currentWeek;

    // 임신 초기 / 중기 / 후기
    private String stage;

    // 영양관리
    private List<WeekContentResponse> foodInfo;

    // 식생활 주의사항
    private List<WeekContentResponse> caution;

    // 몸의 변화
    private List<WeekContentResponse> bodyChange;

}