package com.nausealab.deotlog.category.dto.response;

import com.nausealab.deotlog.category.entity.NauseaIntensity;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class IntensityResponse {

    private Long intensityId;
    private Integer level;
    private String description;

    public static IntensityResponse from(NauseaIntensity entity) {
        return new IntensityResponse(
                entity.getIntensityId(),
                entity.getLevel(),
                entity.getDescription()
        );
    }
}