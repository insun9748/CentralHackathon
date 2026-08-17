package com.nausealab.deotlog.ai.entity;

import com.nausealab.deotlog.record.entity.Record;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "AiAnalysis")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AiAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ai_analysis_id")
    private Long aiAnalysisId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id", nullable = false, unique = true)
    private Record record;

    @Lob
    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @Lob
    @Column(name = "trigger_factor", columnDefinition = "TEXT")
    private String triggerFactor;

    @Lob
    @Column(name = "relief_factor", columnDefinition = "TEXT")
    private String reliefFactor;

    @Lob
    @Column(name = "nausea_type", columnDefinition = "TEXT")
    private String nauseaType;

    @Lob
    @Column(name = "symptom_summary", columnDefinition = "TEXT")
    private String symptomSummary;

    @Lob
    @Column(name = "situation_analysis", columnDefinition = "TEXT")
    private String situationAnalysis;

    @Lob
    @Column(name = "food_analysis", columnDefinition = "TEXT")
    private String foodAnalysis;

    @Lob
    @Column(name = "emotion_analysis", columnDefinition = "TEXT")
    private String emotionAnalysis;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @Column(name = "prompt_version", nullable = false, length = 20)
    private String promptVersion;

    @Builder
    public AiAnalysis(
            Record record,
            String aiSummary,
            String triggerFactor,
            String reliefFactor,
            String nauseaType,
            String symptomSummary,
            String situationAnalysis,
            String foodAnalysis,
            String emotionAnalysis,
            String modelName,
            String promptVersion
    ) {
        this.record = record;
        this.aiSummary = aiSummary;
        this.triggerFactor = triggerFactor;
        this.reliefFactor = reliefFactor;
        this.nauseaType = nauseaType;
        this.symptomSummary = symptomSummary;
        this.situationAnalysis = situationAnalysis;
        this.foodAnalysis = foodAnalysis;
        this.emotionAnalysis = emotionAnalysis;
        this.modelName = modelName;
        this.promptVersion = promptVersion;
    }

    public void update(
            String aiSummary,
            String triggerFactor,
            String reliefFactor,
            String nauseaType,
            String symptomSummary,
            String situationAnalysis,
            String foodAnalysis,
            String emotionAnalysis
    ) {
        this.aiSummary = aiSummary;
        this.triggerFactor = triggerFactor;
        this.reliefFactor = reliefFactor;
        this.nauseaType = nauseaType;
        this.symptomSummary = symptomSummary;
        this.situationAnalysis = situationAnalysis;
        this.foodAnalysis = foodAnalysis;
        this.emotionAnalysis = emotionAnalysis;
    }
}