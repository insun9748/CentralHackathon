package com.nausealab.deotlog.category.controller;

import com.nausealab.deotlog.category.dto.response.CategoryResponse;
import com.nausealab.deotlog.category.service.CategoryService;
import com.nausealab.deotlog.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<CategoryResponse> getCategories() {

        return ApiResponse.success(
                "조회 성공",
                categoryService.getCategories()
        );
    }
}