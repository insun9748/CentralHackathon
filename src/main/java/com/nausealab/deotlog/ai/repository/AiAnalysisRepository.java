package com.nausealab.deotlog.ai.repository;

import com.nausealab.deotlog.ai.entity.AiAnalysis;
import com.nausealab.deotlog.record.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AiAnalysisRepository extends JpaRepository<AiAnalysis, Long> {

    Optional<AiAnalysis> findByRecord(Record record);

}