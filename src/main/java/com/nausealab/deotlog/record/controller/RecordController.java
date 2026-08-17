package com.nausealab.deotlog.record.controller;

import com.nausealab.deotlog.global.response.ApiResponse;
import com.nausealab.deotlog.global.security.CustomUserDetails;
import com.nausealab.deotlog.record.dto.request.RecordCreateRequest;
import com.nausealab.deotlog.record.dto.request.RecordUpdateRequest;
import com.nausealab.deotlog.record.dto.response.RecordCreateResponse;
import com.nausealab.deotlog.record.dto.response.RecordResponse;
import com.nausealab.deotlog.record.service.RecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/records")
public class RecordController {

    private final RecordService recordService;

    /**
     * 기록 생성
     */
    @PostMapping
    public ApiResponse<RecordCreateResponse> createRecord(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody RecordCreateRequest request
    ) {

        RecordCreateResponse response = recordService.createRecord(
                userDetails.getUserId(),
                request
        );

        return ApiResponse.success("기록이 생성되었습니다.", response);
    }

    /**
     * 기록 목록 조회
     */
    @GetMapping
    public ApiResponse<List<RecordResponse>> getRecords(
            @AuthenticationPrincipal CustomUserDetails userDetails,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {

        List<RecordResponse> response =
                recordService.getRecords(
                        userDetails.getUserId(),
                        date
                );

        return ApiResponse.success("조회 성공", response);
    }

    /**
     * 기록 상세 조회
     */
    @GetMapping("/{recordId}")
    public ResponseEntity<ApiResponse<RecordResponse>> getRecord(

            @AuthenticationPrincipal
            CustomUserDetails userDetails,

            @PathVariable Long recordId
    ) {

        RecordResponse response = recordService.getRecord(
                userDetails.getUserId(),
                recordId
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "조회 성공",
                        response
                )
        );
    }

    /**
     * 기록 수정
     */
    @PatchMapping("/{recordId}")
    public ResponseEntity<ApiResponse<Void>> updateRecord(

            @AuthenticationPrincipal
            CustomUserDetails userDetails,

            @PathVariable Long recordId,

            @RequestBody @Valid RecordUpdateRequest request
    ) {

        recordService.updateRecord(
                userDetails.getUserId(),
                recordId,
                request
        );

        return ResponseEntity.ok(
                ApiResponse.success("기록이 수정되었습니다.")
        );
    }

    /**
     * 기록 삭제
     */
    @DeleteMapping("/{recordId}")
    public ResponseEntity<ApiResponse<Void>> deleteRecord(

            @AuthenticationPrincipal
            CustomUserDetails userDetails,

            @PathVariable Long recordId
    ) {

        recordService.deleteRecord(
                userDetails.getUserId(),
                recordId
        );

        return ResponseEntity.ok(
                ApiResponse.success("기록이 삭제되었습니다.")
        );
    }

}