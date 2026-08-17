package com.nausealab.deotlog.category.repository;

import com.nausealab.deotlog.category.entity.TimeCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TimeCategoryRepository extends JpaRepository<TimeCategory, Long> {
    Optional<TimeCategory> findByName(String name);
}