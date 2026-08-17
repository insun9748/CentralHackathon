package com.nausealab.deotlog.ai.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoiceStructuredResponse {

    private String timeCategory;

    private Integer intensity;

    private String memo;

}
