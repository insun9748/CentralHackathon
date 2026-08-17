package com.nausealab.deotlog.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // ==================== Auth ====================

    DUPLICATE_EMAIL(
            HttpStatus.CONFLICT,
            "AUTH_001",
            "이미 사용 중인 이메일입니다."
    ),

    INVALID_LOGIN(
            HttpStatus.UNAUTHORIZED,
            "AUTH_002",
            "이메일 또는 비밀번호가 일치하지 않습니다."
    ),

    INVALID_REFRESH_TOKEN(
            HttpStatus.UNAUTHORIZED,
            "AUTH_003",
            "Refresh Token이 유효하지 않습니다."
    ),

    PASSWORD_MISMATCH(
            HttpStatus.BAD_REQUEST,
            "AUTH_004",
            "비밀번호가 일치하지 않습니다."
    ),

    UNAUTHORIZED(
            HttpStatus.UNAUTHORIZED,
            "AUTH_005",
            "인증이 필요합니다."
    ),

    // ==================== User ====================

    PROFILE_IMAGE_SAVE_FAILED(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "USER_001",
            "프로필 이미지 저장에 실패했습니다."
    ),

    INVALID_IMAGE_TYPE(
            HttpStatus.BAD_REQUEST,
            "USER_002",
            "이미지 파일만 업로드할 수 있습니다."
    ),

    INVALID_IMAGE_EXTENSION(
            HttpStatus.BAD_REQUEST,
            "USER_003",
            "지원하지 않는 이미지 형식입니다."
    ),

    IMAGE_SIZE_EXCEEDED(
            HttpStatus.BAD_REQUEST,
            "USER_004",
            "이미지는 5MB 이하만 업로드할 수 있습니다."
    ),

    USER_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "USER_005",
            "사용자를 찾을 수 없습니다."
    ),

    USER_SETTING_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "USER_006",
            "사용자 설정 정보를 찾을 수 없습니다."
    ),

    INVALID_PREGNANCY_INFO(
            HttpStatus.BAD_REQUEST,
            "USER_007",
            "현재 임신 주차와 출산 예정일이 일치하지 않습니다."
    ),

    // ==================== Record ====================

    RECORD_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "RECORD_001",
            "기록을 찾을 수 없습니다."
    ),

    RECORD_ALREADY_COMPLETED(
            HttpStatus.CONFLICT,
            "RECORD_002",
            "이미 최종 완료된 기록입니다."
    ),

    // ==================== AI ====================

    AI_ANALYSIS_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "AI_001",
            "AI 분석 결과를 찾을 수 없습니다."
    ),

    OPENAI_RESPONSE_NOT_FOUND(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "AI_002",
            "OpenAI 응답을 찾을 수 없습니다."
    ),

    OPENAI_RESPONSE_PARSE_FAILED(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "AI_003",
            "OpenAI 응답을 처리하지 못했습니다."
    ),

    OPENAI_REQUEST_FAILED(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "AI_004",
            "OpenAI 호출에 실패했습니다."
    ),

    // ==================== Report ====================

    INVALID_DATE_RANGE(
            HttpStatus.BAD_REQUEST,
            "REPORT_001",
            "분석 기간이 올바르지 않습니다."
    ),

    // ==================== Category ====================

    TIME_CATEGORY_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "CATEGORY_001",
            "시간대를 찾을 수 없습니다."
    ),

    INTENSITY_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "CATEGORY_002",
            "입덧 강도를 찾을 수 없습니다."
    ),

    PREGNANCY_WEEK_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "CATEGORY_003",
            "임신 주차 정보를 찾을 수 없습니다."
    ),
    

    // ==================== Voice ====================

    VOICE_FILE_READ_FAILED(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "VOICE_001",
            "음성 파일을 읽는 중 오류가 발생했습니다."
    ),

    VOICE_TRANSCRIPTION_FAILED(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "VOICE_002",
            "음성 인식에 실패했습니다."
    ),

    // ==================== Tracker ====================

    DUE_DATE_NOT_FOUND(
            HttpStatus.BAD_REQUEST,
            "TRACKER_001",
            "출산 예정일이 등록되지 않았습니다."
    ),

    PREGNANCY_WEEK_INFO_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "TRACKER_002",
            "해당 주차 정보를 찾을 수 없습니다."
    ),

    // ==================== Common ====================

    INVALID_REQUEST(
            HttpStatus.BAD_REQUEST,
            "COMMON_001",
            "잘못된 요청입니다."
    ),

    INTERNAL_SERVER_ERROR(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "COMMON_999",
            "서버 내부 오류입니다."
    );

    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}