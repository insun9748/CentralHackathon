package com.nausealab.deotlog.category.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "PregnancyWeekInfo")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PregnancyWeekInfo {

    @Id
    @Column(name = "week")
    private Integer week;

    @Lob
    @Column(name = "caution")
    private String caution;

    @Lob
    @Column(name = "food_info")
    private String foodInfo;

    @Lob
    @Column(name = "body_change")
    private String bodyChange;
}