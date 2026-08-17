package com.nausealab.deotlog.ai.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class WhisperResponse {

    /**
     * Whisper가 음성을 텍스트로 변환한 결과
     */
    private String text;

}