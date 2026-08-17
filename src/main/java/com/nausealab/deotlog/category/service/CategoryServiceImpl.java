package com.nausealab.deotlog.category.service;

import com.nausealab.deotlog.category.dto.response.CategoryResponse;
import com.nausealab.deotlog.category.dto.response.IntensityResponse;
import com.nausealab.deotlog.category.dto.response.TimeCategoryResponse;
import com.nausealab.deotlog.category.repository.NauseaIntensityRepository;
import com.nausealab.deotlog.category.repository.TimeCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final TimeCategoryRepository timeCategoryRepository;
    private final NauseaIntensityRepository nauseaIntensityRepository;

    @Override
    public CategoryResponse getCategories() {

        return new CategoryResponse(

                timeCategoryRepository.findAll()
                        .stream()
                        .map(TimeCategoryResponse::from)
                        .toList(),

                nauseaIntensityRepository.findAll()
                        .stream()
                        .map(IntensityResponse::from)
                        .toList()

        );
    }
}