package com.nausealab.deotlog.record.controller;

import com.nausealab.deotlog.global.response.ApiResponse;
import com.nausealab.deotlog.record.dto.response.VoiceRecordResponse;
import com.nausealab.deotlog.record.service.VoiceRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/records")
public class VoiceRecordController {

    private final VoiceRecordService voiceRecordService;

    @PostMapping(
            value = "/voice",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ApiResponse<VoiceRecordResponse> convertVoice(
            @RequestPart("audio") MultipartFile audio
    ) {

        return ApiResponse.success(
                "음성 기록 변환이 완료되었습니다.",
                voiceRecordService.convertVoiceToRecord(audio)
        );
    }
}