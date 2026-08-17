package com.nausealab.deotlog.ai.service;

import com.nausealab.deotlog.ai.dto.response.AiAnalysisResponse;
import com.nausealab.deotlog.ai.dto.response.OpenAiAnalysisResponse;
import com.nausealab.deotlog.ai.entity.AiAnalysis;
import com.nausealab.deotlog.ai.repository.AiAnalysisRepository;
import com.nausealab.deotlog.category.entity.NauseaIntensity;
import com.nausealab.deotlog.category.entity.TimeCategory;
import com.nausealab.deotlog.category.repository.NauseaIntensityRepository;
import com.nausealab.deotlog.category.repository.TimeCategoryRepository;
import com.nausealab.deotlog.record.entity.Record;
import com.nausealab.deotlog.record.repository.RecordRepository;
import com.nausealab.deotlog.user.entity.User;
import com.nausealab.deotlog.user.repository.UserRepository;
import com.nausealab.deotlog.global.exception.CustomException;
import com.nausealab.deotlog.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiServiceImpl implements AiService {

    private final AiAnalysisRepository aiAnalysisRepository;
    private final RecordRepository recordRepository;
    private final UserRepository userRepository;
    private final OpenAiClient openAiClient;
    private final TimeCategoryRepository timeCategoryRepository;
    private final NauseaIntensityRepository nauseaIntensityRepository;

    @Override
    @Transactional
    public AiAnalysisResponse analyzeRecord(
            Long recordId,
            Long userId
    ) {

        // 1. 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.UNAUTHORIZED));

        // 2. 사용자의 기록인지 확인
        Record record = recordRepository
                .findByRecordIdAndUser(recordId, user)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.RECORD_NOT_FOUND));

        // 3. 이미 AI 분석 결과가 존재하는지 확인
        AiAnalysis existingAnalysis =
                aiAnalysisRepository.findByRecord(record)
                        .orElse(null);

        if (existingAnalysis != null) {
            return toResponse(existingAnalysis);
        }

        // 4. 기록을 AI 분석용 Prompt로 변환
        String prompt = createPrompt(record);

        // 5. OpenAI 호출
        OpenAiAnalysisResponse aiResponse =
                openAiClient.analyze(prompt);

        // 6. AI 분석 결과 Entity 생성
        AiAnalysis aiAnalysis = AiAnalysis.builder()
                .record(record)
                .aiSummary(aiResponse.getAiSummary())
                .triggerFactor(aiResponse.getTriggerFactor())
                .reliefFactor(aiResponse.getReliefFactor())
                .nauseaType(aiResponse.getNauseaType())
                .symptomSummary(aiResponse.getSymptomSummary())
                .situationAnalysis(aiResponse.getSituationAnalysis())
                .foodAnalysis(aiResponse.getFoodAnalysis())
                .emotionAnalysis(aiResponse.getEmotionAnalysis())
                .modelName("gpt-5-mini")
                .promptVersion("v1")
                .build();

        // 7. DB 저장
        aiAnalysisRepository.save(aiAnalysis);

        // 8. Response DTO 반환
        return toResponse(aiAnalysis);
    }

    /**
     * Record 정보를 AI 분석용 Prompt로 변환
     */
    private String createPrompt(Record record) {

        TimeCategory timeCategory =
                record.getTimeCategory();

        NauseaIntensity intensity =
                record.getIntensity();

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
            당신은 임신 중 입덧 기록을 분석하는 AI입니다.

            아래 기록을 바탕으로 사용자의 입덧 상태와
            기록 사이의 관계를 분석해주세요.

            단, 의료적 진단이나 치료를 하지 마세요.
            기록에서 관찰되는 경향과 가능성만 설명해주세요.
            기록에 없는 사실은 추측하여 단정하지 마세요.

            분석 결과는 다음 여덟 가지 항목으로 작성해주세요.

            1. aiSummary
            - 해당 기록의 전체적인 요약
            - 두 줄 이하의 분량으로 작성

            2. triggerFactor
            - 입덧을 유발하거나 악화시킨 것으로 관찰되는 가장 구체적인 요인 하나를 작성
            - 음식, 냄새, 공복, 수면 부족, 피로, 특정 행동 등 기록에 명확하게 나타난 요인을 우선 선택
            - 설명이나 판단을 덧붙이지 말고 요인명만 작성
            - 예: "김치찌개 냄새", "공복", "수면 부족", "피로"
            - 동일한 요인은 가능한 한 동일한 표현으로 작성
            - 기록에 명확한 유발 요인이 없으면 "기록 없음"

            3. reliefFactor
            - 증상이 완화되거나 나아지는 데 도움이 된 것으로 기록된 행동이나 요인 하나를 작성
            - 설명이나 판단을 덧붙이지 말고 행동이나 요인명만 작성
            - 예: "창문을 열고 휴식", "식사", "물 섭취"
            - 단순히 행동을 했다는 사실만 있고 증상이 실제로 완화되었다는 근거가 없다면 "기록 없음"
            - 동일한 요인은 가능한 한 동일한 표현으로 작성
            - 기록에 명확한 완화 요인이 없으면 "기록 없음"
            
            4. nauseaType
            - 아래 유형 중 가장 적합한 것을 작성
            - 토덧 : 음식 냄새를 맡기만 해도 구토 증세를 보이는 입덧
            - 먹덧 : 토덧과 반대로 음식을 계속 섭취해야 속이 편안한 입덧
            - 체덧: 조금만 먹어도 체한 거 같이 속이 안 좋아지는 입덧
            - 침덧 : 침이 역하게 느껴져 침을 삼키지 못하는 입덧
            - 냄새덧 : 냄새에 민감해지는 입덧
            - 양치덧 : 칫솔 등이 입에 들어오는 것이 역하게 느껴지는 입덧
            - 판단 불가
            - 위 일곱 개 이외의 값은 절대 반환하지 마세요.
            
            5. symptomSummary
            - 사용자가 작성한 메모에서 나타나는 입덧 증상을 한두 문장으로 요약
            - 메모에 나타난 증상만 요약
            - 기록에 없는 증상은 추측하지 말 것
            - 증상이 명확하지 않으면 "기록 없음"
            
            6. situationAnalysis
            - 기록 당시의 상황과 입덧의 관계를 분석

            7. foodAnalysis
            - 음식과 입덧 증상의 관계
            - 기록에 음식 정보가 없으면 "기록 없음"으로 표시

            8. emotionAnalysis
            - 감정과 입덧 증상의 관계
            - 기록에 감정 정보가 없으면 "기록 없음"으로 표시

            [입덧 기록]
            """);

        prompt.append("\n시간대: ")
                .append(timeCategory.getName());

        prompt.append("\n입덧 강도: ")
                .append(intensity.getLevel())
                .append(" - ")
                .append(intensity.getDescription());

        prompt.append("\n기록 시간: ")
                .append(record.getRecordDateTime());

        prompt.append("\n메모: ")
                .append(valueOrNone(record.getMemo()));


        return prompt.toString();
    }

    /**
     * null 또는 빈 문자열 처리
     */
    private String valueOrNone(String value) {

        if (value == null || value.isBlank()) {
            return "기록 없음";
        }

        return value;
    }

    /**
     * Entity → Response DTO
     */
    private AiAnalysisResponse toResponse(
            AiAnalysis aiAnalysis
    ) {

        return AiAnalysisResponse.builder()
                .aiAnalysisId(
                        aiAnalysis.getAiAnalysisId()
                )
                .recordId(
                        aiAnalysis.getRecord().getRecordId()
                )
                .aiSummary(
                        aiAnalysis.getAiSummary()
                )
                .triggerFactor(
                        aiAnalysis.getTriggerFactor()
                )
                .reliefFactor(
                        aiAnalysis.getReliefFactor()
                )
                .nauseaType(
                        aiAnalysis.getNauseaType()
                )
                .symptomSummary(
                        aiAnalysis.getSymptomSummary()
                )
                .situationAnalysis(
                        aiAnalysis.getSituationAnalysis()
                )
                .foodAnalysis(
                        aiAnalysis.getFoodAnalysis()
                )
                .emotionAnalysis(
                        aiAnalysis.getEmotionAnalysis()
                )
                .modelName(
                        aiAnalysis.getModelName()
                )
                .promptVersion(
                        aiAnalysis.getPromptVersion()
                )
                .build();
    }

}