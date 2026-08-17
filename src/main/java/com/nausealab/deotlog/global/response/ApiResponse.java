package com.nausealab.deotlog.global.response;

import com.nausealab.deotlog.global.exception.ErrorCode;
import lombok.Getter;

@Getter
public class ApiResponse<T> {

    private final boolean success;
    private final String message;
    private final String errorCode;
    private final T data;

    private ApiResponse(boolean success, String message, String errorCode, T data) {
        this.success = success;
        this.message = message;
        this.errorCode = errorCode;
        this.data = data;
    }

    // 성공(데이터 없음)
    public static ApiResponse<Void> success(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    // 성공(데이터 있음)
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, null, data);
    }

    // 실패
    public static ApiResponse<Void> fail(ErrorCode errorCode) {
        return new ApiResponse<>(
                false,
                errorCode.getMessage(),
                errorCode.getCode(),
                null
        );
    }
}