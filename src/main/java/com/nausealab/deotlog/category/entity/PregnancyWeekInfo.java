package com.nausealab.deotlog.category.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "pregnancy_week_info")
public class PregnancyWeekInfo {

    @Id
    @Column(name = "week")
    private Integer week;

    @OneToMany(
            mappedBy = "pregnancyWeekInfo",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<PregnancyWeekContent> contents = new ArrayList<>();
}