package com.nausealab.deotlog.category.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "NauseaIntensity")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NauseaIntensity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "intensity_id")
    private Long intensityId;

    @Column(nullable = false)
    private Integer level;

    @Column(nullable = false, length = 30)
    private String description;
}
