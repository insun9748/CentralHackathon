package com.nausealab.deotlog.record.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class VoiceRecordResponse {

    private Long timeCategoryId;

    private Long intensityId;

    private String memo;

    private String originalText;

}
