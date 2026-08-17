package com.nausealab.deotlog.category.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "TimeCategory")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TimeCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "time_category_id")
    private Long timeCategoryId;

    @Column(nullable = false, length = 30)
    private String name;
}
