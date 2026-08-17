package com.nausealab.deotlog.ai.controller;

import com.nausealab.deotlog.ai.dto.response.AiAnalysisResponse;
import com.nausealab.deotlog.ai.service.AiService;
import com.nausealab.deotlog.global.response.ApiResponse;
import com.nausealab.deotlog.global.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/records")
public class AiController {

    private final AiService aiService;

    /**
     * 기록 AI 분석
     *
     * POST /records/{recordId}/analysis
     */
    @PostMapping("/{recordId}/analysis")
    public ResponseEntity<ApiResponse<AiAnalysisResponse>> analyzeRecord(
            @PathVariable Long recordId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        Long userId = userDetails.getUserId();

        AiAnalysisResponse response =
                aiService.analyzeRecord(recordId, userId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "AI 분석이 완료되었습니다.",
                        response
                )
        );
    }

}