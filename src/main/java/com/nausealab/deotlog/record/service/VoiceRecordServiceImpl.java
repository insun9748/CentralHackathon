package com.nausealab.deotlog.record.service;

import com.nausealab.deotlog.ai.dto.response.VoiceStructuredResponse;
import com.nausealab.deotlog.ai.service.OpenAiClient;
import com.nausealab.deotlog.ai.service.WhisperClient;
import com.nausealab.deotlog.category.entity.NauseaIntensity;
import com.nausealab.deotlog.category.entity.TimeCategory;
import com.nausealab.deotlog.category.repository.NauseaIntensityRepository;
import com.nausealab.deotlog.category.repository.TimeCategoryRepository;
import com.nausealab.deotlog.global.exception.CustomException;
import com.nausealab.deotlog.global.exception.ErrorCode;
import com.nausealab.deotlog.record.dto.response.VoiceRecordResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VoiceRecordServiceImpl implements VoiceRecordService {

    private final WhisperClient whisperClient;
    private final OpenAiClient openAiClient;

    private final TimeCategoryRepository timeCategoryRepository;
    private final NauseaIntensityRepository nauseaIntensityRepository;

    @Override
    public VoiceRecordResponse convertVoiceToRecord(MultipartFile audio) {

        // 1. 음성 -> 텍스트(STT)
        String originalText = whisperClient.transcribe(audio);

        // 2. 텍스트 -> 구조화된 JSON
        VoiceStructuredResponse structured =
                openAiClient.analyzeVoice(originalText);

        // 3. 시간대 조회
        TimeCategory timeCategory =
                timeCategoryRepository
                        .findByName(structured.getTimeCategory())
                        .orElseThrow(() ->
                                new CustomException(
                                        ErrorCode.TIME_CATEGORY_NOT_FOUND
                                ));

        // 4. 입덧 강도 조회
        NauseaIntensity intensity =
                nauseaIntensityRepository
                        .findByLevel(structured.getIntensity())
                        .orElseThrow(() ->
                                new CustomException(
                                        ErrorCode.INTENSITY_NOT_FOUND
                                ));


        // 6. 응답 반환
        return VoiceRecordResponse.builder()
                .timeCategoryId(timeCategory.getTimeCategoryId())
                .intensityId(intensity.getIntensityId())
                .memo(structured.getMemo())
                .originalText(originalText)
                .build();
    }
}