package com.nausealab.deotlog.report.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReliefFactorResponse {

    private String factor;
    private int count;
}