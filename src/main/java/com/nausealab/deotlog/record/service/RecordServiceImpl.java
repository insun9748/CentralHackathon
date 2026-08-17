package com.nausealab.deotlog.record.service;


import com.nausealab.deotlog.ai.repository.AiAnalysisRepository;
import com.nausealab.deotlog.category.dto.response.IntensityResponse;
import com.nausealab.deotlog.category.dto.response.TimeCategoryResponse;
import com.nausealab.deotlog.category.entity.TimeCategory;
import com.nausealab.deotlog.category.repository.NauseaIntensityRepository;
import com.nausealab.deotlog.category.repository.TimeCategoryRepository;
import com.nausealab.deotlog.global.exception.CustomException;
import com.nausealab.deotlog.global.exception.ErrorCode;
import com.nausealab.deotlog.record.dto.request.RecordCreateRequest;
import com.nausealab.deotlog.record.dto.request.RecordUpdateRequest;
import com.nausealab.deotlog.record.dto.response.RecordCreateResponse;
import com.nausealab.deotlog.record.dto.response.RecordResponse;
import com.nausealab.deotlog.record.repository.RecordRepository;
import com.nausealab.deotlog.ai.entity.AiAnalysis;
import com.nausealab.deotlog.user.entity.User;
import com.nausealab.deotlog.category.entity.NauseaIntensity;
import com.nausealab.deotlog.record.entity.Record;
import com.nausealab.deotlog.record.entity.RecordStatus;
import com.nausealab.deotlog.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecordServiceImpl implements RecordService {

    private final RecordRepository recordRepository;
    private final UserRepository userRepository;
    private final TimeCategoryRepository timeCategoryRepository;
    private final NauseaIntensityRepository nauseaIntensityRepository;
    private final AiAnalysisRepository aiAnalysisRepository;

    @Override
    @Transactional
    public RecordCreateResponse createRecord(
            Long userId,
            RecordCreateRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.UNAUTHORIZED));

        TimeCategory timeCategory = timeCategoryRepository
                .findById(request.getTimeCategoryId())
                .orElseThrow(() ->
                        new CustomException(ErrorCode.TIME_CATEGORY_NOT_FOUND));

        NauseaIntensity intensity = nauseaIntensityRepository
                .findById(request.getIntensityId())
                .orElseThrow(() ->
                        new CustomException(ErrorCode.INTENSITY_NOT_FOUND));

        Record record = Record.builder()
                .user(user)
                .timeCategory(timeCategory)
                .intensity(intensity)
                .recordDateTime(request.getRecordDateTime())
                .memo(request.getMemo())
                .status(RecordStatus.DRAFT)
                .build();

        recordRepository.save(record);

        return new RecordCreateResponse(record.getRecordId());
    }

    @Override
    public List<RecordResponse> getRecords(
            Long userId,
            LocalDate date
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.UNAUTHORIZED));

        List<Record> records;

        if (date == null) {

            records = recordRepository.findByUserOrderByRecordDateTimeDesc(user);

        } else {

            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.plusDays(1).atStartOfDay();

            records = recordRepository.findByUserAndRecordDateTimeBetween(
                    user,
                    start,
                    end
            );
        }

        return records.stream()
                .map(this::toRecordResponse)
                .toList();
    }

    private RecordResponse toRecordResponse(Record record) {

        return RecordResponse.builder()
                .recordId(record.getRecordId())
                .recordDateTime(record.getRecordDateTime())

                .timeCategory(
                        new TimeCategoryResponse(
                                record.getTimeCategory().getTimeCategoryId(),
                                record.getTimeCategory().getName()
                        )
                )

                .intensity(
                        new IntensityResponse(
                                record.getIntensity().getIntensityId(),
                                record.getIntensity().getLevel(),
                                record.getIntensity().getDescription()
                        )
                )


                .memo(record.getMemo())

                .status(record.getStatus())

                .build();
    }


    @Override
    public RecordResponse getRecord(
            Long userId,
            Long recordId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.UNAUTHORIZED));

        Record record = recordRepository.findByRecordIdAndUser(
                        recordId,
                        user
                )
                .orElseThrow(() ->
                        new CustomException(ErrorCode.RECORD_NOT_FOUND));

        return toRecordResponse(record);
    }
    @Override
    @Transactional
    public void updateRecord(
            Long userId,
            Long recordId,
            RecordUpdateRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.UNAUTHORIZED));

        Record record = recordRepository.findByRecordIdAndUser(
                        recordId,
                        user
                )
                .orElseThrow(() ->
                        new CustomException(ErrorCode.RECORD_NOT_FOUND));

        // 이미 최종 저장된 기록은 수정할 수 없음
        if (record.getStatus() == RecordStatus.COMPLETED) {
            throw new CustomException(
                    ErrorCode.RECORD_ALREADY_COMPLETED
            );
        }

        TimeCategory timeCategory =
                timeCategoryRepository.findById(request.getTimeCategoryId())
                        .orElseThrow(() ->
                                new CustomException(ErrorCode.TIME_CATEGORY_NOT_FOUND));

        NauseaIntensity intensity =
                nauseaIntensityRepository.findById(request.getIntensityId())
                        .orElseThrow(() ->
                                new CustomException(ErrorCode.INTENSITY_NOT_FOUND));

        record.update(
                timeCategory,
                intensity,
                request.getRecordDateTime(),
                request.getMemo()
        );

        AiAnalysis aiAnalysis =
                aiAnalysisRepository.findByRecord(record)
                        .orElseThrow(() ->
                                new CustomException(
                                        ErrorCode.AI_ANALYSIS_NOT_FOUND
                                )
                        );

        aiAnalysis.update(
                request.getAiSummary(),
                request.getTriggerFactor(),
                request.getReliefFactor(),
                request.getNauseaType(),
                request.getSymptomSummary(),
                request.getSituationAnalysis(),
                request.getFoodAnalysis(),
                request.getEmotionAnalysis()
        );

    }

    @Override
    @Transactional
    public void deleteRecord(
            Long userId,
            Long recordId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.UNAUTHORIZED));

        Record record = recordRepository.findByRecordIdAndUser(
                        recordId,
                        user
                )
                .orElseThrow(() ->
                        new CustomException(ErrorCode.RECORD_NOT_FOUND));

        recordRepository.delete(record);
    }


}