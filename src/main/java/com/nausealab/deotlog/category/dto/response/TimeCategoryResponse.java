package com.nausealab.deotlog.category.dto.response;

import com.nausealab.deotlog.category.entity.TimeCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TimeCategoryResponse {

    private Long timeCategoryId;
    private String name;

    public static TimeCategoryResponse from(TimeCategory entity) {
        return new TimeCategoryResponse(
                entity.getTimeCategoryId(),
                entity.getName()
        );
    }
}