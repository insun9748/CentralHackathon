package com.nausealab.deotlog.category.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "pregnancy_week_content")
public class PregnancyWeekContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private Long contentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "week", nullable = false)
    private PregnancyWeekInfo pregnancyWeekInfo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SectionType section;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String highlight;

    @Column(nullable = false)
    private Integer displayOrder;
}