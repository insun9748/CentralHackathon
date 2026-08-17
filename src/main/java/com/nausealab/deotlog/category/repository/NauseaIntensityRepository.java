package com.nausealab.deotlog.category.repository;

import com.nausealab.deotlog.category.entity.NauseaIntensity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NauseaIntensityRepository extends JpaRepository<NauseaIntensity, Long> {
    Optional<NauseaIntensity> findByLevel(Integer level);
}