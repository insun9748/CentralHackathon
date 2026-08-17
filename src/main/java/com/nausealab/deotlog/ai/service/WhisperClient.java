package com.nausealab.deotlog.ai.service;

import com.nausealab.deotlog.ai.dto.response.WhisperResponse;
import com.nausealab.deotlog.global.exception.CustomException;
import com.nausealab.deotlog.global.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class WhisperClient {

    private final RestClient restClient;

    public WhisperClient(
            @Value("${openai.api-key}") String apiKey
    ) {

        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + apiKey
                )
                .build();
    }

    /**
     * Whisper를 이용하여
     * 음성을 텍스트로 변환한다.
     */
    public String transcribe(
            MultipartFile audio
    ) {

        MultipartBodyBuilder builder =
                new MultipartBodyBuilder();

        try {

            builder.part(
                            "file",
                            new ByteArrayResource(audio.getBytes()) {

                                @Override
                                public String getFilename() {

                                    return audio.getOriginalFilename() != null
                                            ? audio.getOriginalFilename()
                                            : "voice.m4a";
                                }
                            })
                    .contentType(
                            MediaType.parseMediaType(
                                    audio.getContentType() != null
                                            ? audio.getContentType()
                                            : "audio/m4a"
                            )
                    );

        } catch (IOException e) {

            throw new CustomException(
                    ErrorCode.VOICE_FILE_READ_FAILED
            );
        }

        builder.part(
                "model",
                "gpt-4o-mini-transcribe"
        );

        try {

            WhisperResponse response =
                    restClient.post()
                            .uri("/audio/transcriptions")
                            .contentType(
                                    MediaType.MULTIPART_FORM_DATA
                            )
                            .body(builder.build())
                            .retrieve()
                            .body(WhisperResponse.class);

            if (response == null
                    || response.getText() == null
                    || response.getText().isBlank()) {

                throw new CustomException(
                        ErrorCode.VOICE_TRANSCRIPTION_FAILED
                );
            }

            return response.getText();

        } catch (RestClientResponseException e) {
            System.out.println(e.getStatusCode());
            System.out.println(e.getResponseBodyAsString());
            throw new CustomException(
                    ErrorCode.VOICE_TRANSCRIPTION_FAILED
            );
        }
    }

}