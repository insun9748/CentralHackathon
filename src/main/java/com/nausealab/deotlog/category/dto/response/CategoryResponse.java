package com.nausealab.deotlog.category.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CategoryResponse {

    private List<TimeCategoryResponse> timeCategories;
    private List<IntensityResponse> intensities;

}