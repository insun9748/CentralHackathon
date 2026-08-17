package com.nausealab.deotlog.record.service;

import com.nausealab.deotlog.record.dto.request.RecordCreateRequest;
import com.nausealab.deotlog.record.dto.request.RecordUpdateRequest;
import com.nausealab.deotlog.record.dto.response.RecordCreateResponse;
import com.nausealab.deotlog.record.dto.response.RecordResponse;

import java.time.LocalDate;
import java.util.List;

public interface RecordService {

    /**
     * 기록 생성
     */
    RecordCreateResponse createRecord(
            Long userId,
            RecordCreateRequest request
    );

    /**
     * 기록 목록 조회
     * date가 null이면 전체 조회
     */
    List<RecordResponse> getRecords(
            Long userId,
            LocalDate date
    );

    /**
     * 기록 상세 조회
     */
    RecordResponse getRecord(
            Long userId,
            Long recordId
    );

    /**
     * 기록 수정
     */
    void updateRecord(
            Long userId,
            Long recordId,
            RecordUpdateRequest request
    );

    /**
     * 기록 삭제
     */
    void deleteRecord(
            Long userId,
            Long recordId
    );

}