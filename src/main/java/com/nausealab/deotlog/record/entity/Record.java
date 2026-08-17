package com.nausealab.deotlog.record.entity;

import com.nausealab.deotlog.category.entity.NauseaIntensity;
import com.nausealab.deotlog.category.entity.TimeCategory;
import com.nausealab.deotlog.user.entity.User;
import com.nausealab.deotlog.ai.entity.AiAnalysis;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Record")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long recordId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_category_id", nullable = false)
    private TimeCategory timeCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intensity_id", nullable = false)
    private NauseaIntensity intensity;

    @Column(name = "record_datetime", nullable = false)
    private LocalDateTime recordDateTime;

    @Lob
    private String memo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecordStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "record", fetch = FetchType.LAZY)
    private AiAnalysis aiAnalysis;

    @Builder
    public Record(
            User user,
            TimeCategory timeCategory,
            NauseaIntensity intensity,
            LocalDateTime recordDateTime,
            String memo,
            RecordStatus status
    ) {
        this.user = user;
        this.timeCategory = timeCategory;
        this.intensity = intensity;
        this.recordDateTime = recordDateTime;
        this.memo = memo;
        this.status = status != null ? status : RecordStatus.DRAFT;
    }

    public void update(
            TimeCategory timeCategory,
            NauseaIntensity intensity,
            LocalDateTime recordDateTime,
            String memo
    ) {
        this.timeCategory = timeCategory;
        this.intensity = intensity;
        this.recordDateTime = recordDateTime;
        this.memo = memo;
    }

    public void complete() {
        this.status = RecordStatus.COMPLETED;
    }
}