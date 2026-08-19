package com.nausealab.deotlog.category.repository;

import com.nausealab.deotlog.category.entity.PregnancyWeekContent;
import com.nausealab.deotlog.category.entity.SectionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PregnancyWeekContentRepository
        extends JpaRepository<PregnancyWeekContent, Long> {

    List<PregnancyWeekContent>
    findByPregnancyWeekInfo_WeekAndSectionOrderByDisplayOrderAsc(
            Integer week,
            SectionType section
    );
}