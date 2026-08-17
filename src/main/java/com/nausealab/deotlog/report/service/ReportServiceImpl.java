package com.nausealab.deotlog.report.service;

import com.nausealab.deotlog.ai.entity.AiAnalysis;
import com.nausealab.deotlog.ai.service.OpenAiClient;
import com.nausealab.deotlog.global.exception.CustomException;
import com.nausealab.deotlog.global.exception.ErrorCode;
import com.nausealab.deotlog.record.entity.Record;
import com.nausealab.deotlog.record.entity.RecordStatus;
import com.nausealab.deotlog.record.repository.RecordRepository;
import com.nausealab.deotlog.report.dto.response.ReliefFactorResponse;
import com.nausealab.deotlog.report.dto.response.ReportAiResponse;
import com.nausealab.deotlog.report.dto.response.ReportResponse;
import com.nausealab.deotlog.report.dto.response.TimeCategoryAnalysisResponse;
import com.nausealab.deotlog.report.dto.response.TriggerFactorResponse;
import com.nausealab.deotlog.user.entity.User;
import com.nausealab.deotlog.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final UserRepository userRepository;
    private final RecordRepository recordRepository;
    private final OpenAiClient openAiClient;

    @Override
    public ReportResponse getReport(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    ) {

        // 1. 사용자 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.UNAUTHORIZED)
                );

        // 2. 날짜 검증
        if (startDate == null || endDate == null) {
            throw new CustomException(
                    ErrorCode.INVALID_DATE_RANGE
            );
        }

        if (startDate.isAfter(endDate)) {
            throw new CustomException(
                    ErrorCode.INVALID_DATE_RANGE
            );
        }

        // 3. 해당 기간의 COMPLETED 기록 조회
        LocalDateTime startDateTime =
                startDate.atStartOfDay();

        LocalDateTime endDateTime =
                endDate.plusDays(1).atStartOfDay();

        List<Record> records =
                recordRepository.findRecordsForReport(
                        user,
                        RecordStatus.COMPLETED,
                        startDateTime,
                        endDateTime
                );

        // 전체 기록 수
        int totalRecords = records.size();

        // 시간대별 평균 입덧 강도
        List<TimeCategoryAnalysisResponse> timeCategoryAnalysis =
                calculateTimeCategoryAnalysis(records);

        // 유발 요인 TOP3
        List<TriggerFactorResponse> triggerFactors =
                calculateTriggerFactors(records);

        // 완화 요인 TOP3
        List<ReliefFactorResponse> reliefFactors =
                calculateReliefFactors(records);

        // AI 리포트
        String aiTrend = null;
        String aiManagementGuide = null;

        if (totalRecords > 0) {

            String reportPrompt = createReportPrompt(
                    startDate,
                    endDate,
                    totalRecords,
                    timeCategoryAnalysis,
                    triggerFactors,
                    reliefFactors
            );

            ReportAiResponse aiResponse =
                    openAiClient.analyzeReport(reportPrompt);

            aiTrend = aiResponse.getAiTrend();
            aiManagementGuide =
                    aiResponse.getAiManagementGuide();
        }

        return ReportResponse.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalRecords(totalRecords)
                .timeCategoryAnalysis(timeCategoryAnalysis)
                .triggerFactors(triggerFactors)
                .reliefFactors(reliefFactors)
                .aiTrend(aiTrend)
                .aiManagementGuide(aiManagementGuide)
                .build();
    }

    /**
     * 시간대별 평균 입덧 강도
     */
    private List<TimeCategoryAnalysisResponse>
    calculateTimeCategoryAnalysis(
            List<Record> records
    ) {

        return records.stream()
                .collect(Collectors.groupingBy(
                        Record::getTimeCategory
                ))
                .entrySet()
                .stream()
                .map(entry -> {

                    var timeCategory = entry.getKey();

                    List<Record> categoryRecords =
                            entry.getValue();

                    double average =
                            categoryRecords.stream()
                                    .mapToInt(record ->
                                            record.getIntensity()
                                                    .getLevel()
                                    )
                                    .average()
                                    .orElse(0.0);

                    return TimeCategoryAnalysisResponse.builder()
                            .timeCategoryId(
                                    timeCategory.getTimeCategoryId()
                            )
                            .timeCategory(
                                    timeCategory.getName()
                            )
                            .averageIntensity(
                                    round(average)
                            )
                            .recordCount(
                                    categoryRecords.size()
                            )
                            .build();
                })
                .sorted(
                        Comparator.comparing(
                                TimeCategoryAnalysisResponse
                                        ::getTimeCategoryId
                        )
                )
                .toList();
    }

    /**
     * AI 분석에서 추출된 유발 요인 TOP3
     */
    private List<TriggerFactorResponse>
    calculateTriggerFactors(
            List<Record> records
    ) {

        return records.stream()
                .map(Record::getAiAnalysis)
                .filter(aiAnalysis -> aiAnalysis != null)
                .map(AiAnalysis::getTriggerFactor)
                .filter(this::isValidFactor)
                .collect(Collectors.groupingBy(
                        factor -> factor,
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .map(entry ->
                        TriggerFactorResponse.builder()
                                .factor(entry.getKey())
                                .count(
                                        entry.getValue().intValue()
                                )
                                .build()
                )
                .sorted(
                        Comparator.comparing(
                                TriggerFactorResponse::getCount
                        ).reversed()
                )
                .limit(3)
                .toList();
    }

    /**
     * AI 분석에서 추출된 완화 요인 TOP3
     */
    private List<ReliefFactorResponse>
    calculateReliefFactors(
            List<Record> records
    ) {

        return records.stream()
                .map(Record::getAiAnalysis)
                .filter(aiAnalysis -> aiAnalysis != null)
                .map(AiAnalysis::getReliefFactor)
                .filter(this::isValidFactor)
                .collect(Collectors.groupingBy(
                        factor -> factor,
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .map(entry ->
                        ReliefFactorResponse.builder()
                                .factor(entry.getKey())
                                .count(
                                        entry.getValue().intValue()
                                )
                                .build()
                )
                .sorted(
                        Comparator.comparing(
                                ReliefFactorResponse::getCount
                        ).reversed()
                )
                .limit(3)
                .toList();
    }

    /**
     * 통계에 포함할 요인인지 확인
     */
    private boolean isValidFactor(
            String factor
    ) {

        return factor != null
                && !factor.isBlank()
                && !"기록 없음".equals(factor);
    }

    /**
     * 소수점 첫째 자리까지 반올림
     */
    private double round(
            double value
    ) {

        return Math.round(value * 10.0) / 10.0;
    }

    /**
     * 리포트 통계 데이터를 AI 분석용 Prompt로 변환
     */
    private String createReportPrompt(
            LocalDate startDate,
            LocalDate endDate,
            int totalRecords,
            List<TimeCategoryAnalysisResponse> timeCategoryAnalysis,
            List<TriggerFactorResponse> triggerFactors,
            List<ReliefFactorResponse> reliefFactors
    ) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
        당신은 임신 중 입덧 기록을 분석하는 AI입니다.

        아래의 누적 기록 통계를 바탕으로
        사용자의 입덧 패턴을 요약해주세요.

        반드시 기록에 근거해서만 분석하세요.
        의료적 진단이나 치료를 하지 마세요.
        기록에 없는 내용을 추측하지 마세요.

        아래 두 항목만 작성하세요.

        1. aiTrend
        - 반드시 한 문장으로 작성
        - 40자 내외
        - 사용자의 가장 특징적인 입덧 패턴을 요약
        - 시간대별 강도와 반복되는 유발요인을 함께 고려

        2. aiManagementGuide
        - 2~3문장
        - 120자 이하
        - 반복되는 유발요인을 피하거나 관찰하는 방법
        - 도움이 되었던 완화요인을 활용하는 방법
        - "~해보세요", "~도움이 될 수 있습니다"와 같이
          부드럽게 제안하는 표현 사용
        - 의료적 진단이나 치료를 하지 마세요.

        [분석 기간]
        """);

        prompt.append("\n시작 날짜: ")
                .append(startDate);

        prompt.append("\n종료 날짜: ")
                .append(endDate);

        prompt.append("\n기록 수: ")
                .append(totalRecords)
                .append("건");

        prompt.append("\n\n[시간대별 평균 입덧 강도]");

        if (timeCategoryAnalysis.isEmpty()) {

            prompt.append("\n- 기록 없음");

        } else {

            for (TimeCategoryAnalysisResponse time :
                    timeCategoryAnalysis) {

                prompt.append("\n- ")
                        .append(time.getTimeCategory())
                        .append(": 평균 강도 ")
                        .append(time.getAverageIntensity())
                        .append(", 기록 ")
                        .append(time.getRecordCount())
                        .append("건");
            }
        }

        prompt.append("\n\n[주요 유발 요인 TOP3]");

        if (triggerFactors.isEmpty()) {

            prompt.append("\n- 기록 없음");

        } else {

            for (TriggerFactorResponse trigger :
                    triggerFactors) {

                prompt.append("\n- ")
                        .append(trigger.getFactor())
                        .append(" (")
                        .append(trigger.getCount())
                        .append("회)");
            }
        }

        prompt.append("\n\n[주요 완화 요인 TOP3]");

        if (reliefFactors.isEmpty()) {

            prompt.append("\n- 기록 없음");

        } else {

            for (ReliefFactorResponse relief :
                    reliefFactors) {

                prompt.append("\n- ")
                        .append(relief.getFactor())
                        .append(" (")
                        .append(relief.getCount())
                        .append("회)");
            }
        }

        return prompt.toString();
    }
}