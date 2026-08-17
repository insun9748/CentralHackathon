package com.nausealab.deotlog.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nausealab.deotlog.ai.dto.response.OpenAiAnalysisResponse;
import com.nausealab.deotlog.ai.dto.response.VoiceStructuredResponse;
import com.nausealab.deotlog.report.dto.response.ReportAiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.boot.http.client.ClientHttpRequestFactoryBuilder;
import org.springframework.boot.http.client.ClientHttpRequestFactorySettings;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import com.nausealab.deotlog.global.exception.CustomException;
import com.nausealab.deotlog.global.exception.ErrorCode;

import java.time.Duration;
import java.util.Map;

@Component
public class OpenAiClient {

    // gpt-5-mini는 추론(reasoning) 모델이라 구조화된 JSON 응답을 만드는 데
    // 기본 타임아웃(수 초)보다 오래 걸릴 수 있어 read timeout을 넉넉하게 잡는다
    private static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(10);
    private static final Duration READ_TIMEOUT = Duration.ofSeconds(90);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public OpenAiClient(
            @Value("${openai.api-key}") String apiKey,
            ObjectMapper objectMapper
    ) {
        ClientHttpRequestFactorySettings settings = ClientHttpRequestFactorySettings.defaults()
                .withConnectTimeout(CONNECT_TIMEOUT)
                .withReadTimeout(READ_TIMEOUT);

        ClientHttpRequestFactory requestFactory = ClientHttpRequestFactoryBuilder.detect().build(settings);

        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .requestFactory(requestFactory)
                .defaultHeader(
                        "Authorization",
                        "Bearer " + apiKey
                )
                .defaultHeader(
                        "Content-Type",
                        MediaType.APPLICATION_JSON_VALUE
                )
                .build();

        this.objectMapper = objectMapper;
    }

    /**
     * 입덧 기록을 분석하여 구조화된 AI 분석 결과 반환
     */
    public OpenAiAnalysisResponse analyze(String prompt) {

        Map<String, Object> responseFormat = Map.of(
                "type", "json_schema",
                "name", "nausea_analysis",
                "description", "임신 중 입덧 기록을 분석한 결과",
                "strict", true,
                "schema", Map.of(
                        "type", "object",
                        "properties", Map.of(

                                "aiSummary", Map.of(
                                        "type", "string",
                                        "description",
                                        "입덧 기록에 대한 종합적인 요약"
                                ),

                                "triggerFactor", Map.of(
                                        "type", "string",
                                        "description",
                                        "입덧 증상을 유발하거나 악화시킨 것으로 추정되는 요인"
                                ),

                                "reliefFactor", Map.of(
                                        "type", "string",
                                        "description",
                                        "입덧 증상이 완화되거나 나아지는 데 도움이 된 것으로 기록에서 관찰되는 행동이나 요인"
                                ),

                                "nauseaType", Map.of(
                                        "type", "string",
                                        "description", "입덧 유형"
                                ),

                                "symptomSummary", Map.of(
                                        "type", "string",
                                        "description", "주요 증상 요약"
                                ),

                                "situationAnalysis", Map.of(
                                        "type", "string",
                                        "description", "상황 분석"
                                ),

                                "foodAnalysis", Map.of(
                                        "type", "string",
                                        "description",
                                        "기록된 음식과 입덧 증상의 관계에 대한 분석"
                                ),

                                "emotionAnalysis", Map.of(
                                        "type", "string",
                                        "description",
                                        "기록된 감정과 입덧 증상의 관계에 대한 분석"
                                )

                        ),

                        "required", new String[]{
                                "aiSummary",
                                "triggerFactor",
                                "reliefFactor",
                                "nauseaType",
                                "symptomSummary",
                                "situationAnalysis",
                                "foodAnalysis",
                                "emotionAnalysis"
                        },

                        "additionalProperties", false
                )
        );

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-5-mini",
                "input", prompt,
                "text", Map.of(
                        "format", responseFormat
                )
        );

        String responseBody;

        try {

            responseBody = restClient.post()
                    .uri("/responses")
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

        } catch (Exception e) {

            throw new CustomException(
                    ErrorCode.OPENAI_REQUEST_FAILED
            );
        }

        return parseResponse(responseBody);
    }

    /**
     * OpenAI Responses API 응답에서
     * 실제 JSON 분석 결과를 추출
     */
    private OpenAiAnalysisResponse parseResponse(
            String responseBody
    ) {

        try {

            JsonNode root = objectMapper.readTree(responseBody);

            JsonNode output = root.get("output");

            if (output == null || !output.isArray()) {
                throw new CustomException(
                        ErrorCode.OPENAI_RESPONSE_NOT_FOUND
                );
            }

            for (JsonNode outputItem : output) {

                if (!"message".equals(
                        outputItem.path("type").asText()
                )) {
                    continue;
                }

                JsonNode content = outputItem.get("content");

                if (content == null || !content.isArray()) {
                    continue;
                }

                for (JsonNode contentItem : content) {

                    if (!"output_text".equals(
                            contentItem.path("type").asText()
                    )) {
                        continue;
                    }

                    String jsonText =
                            contentItem.path("text").asText();

                    return objectMapper.readValue(
                            jsonText,
                            OpenAiAnalysisResponse.class
                    );
                }
            }

            throw new CustomException(
                    ErrorCode.OPENAI_RESPONSE_NOT_FOUND
            );

        } catch (CustomException e) {
            throw e;
        }
        catch (Exception e) {
            throw new CustomException(
                    ErrorCode.OPENAI_RESPONSE_PARSE_FAILED
            );
        }
    }

    /**
     * 누적 입덧 기록 통계를 AI가 분석하여
     * 개인별 입덧 경향과 관리 방향을 반환
     */
    public ReportAiResponse analyzeReport(String prompt) {

        Map<String, Object> responseFormat = Map.of(
                "type", "json_schema",
                "name", "nausea_report_analysis",
                "description", "누적 입덧 기록을 분석한 개인별 리포트",
                "strict", true,
                "schema", Map.of(
                        "type", "object",
                        "properties", Map.of(

                                "aiTrend", Map.of(
                                        "type", "string",
                                        "description",
                                        "누적 입덧 기록에서 관찰되는 개인별 입덧 경향"
                                ),

                                "aiManagementGuide", Map.of(
                                        "type", "string",
                                        "description",
                                        "사용자의 기록된 패턴을 바탕으로 제안하는 개인 맞춤 입덧 관리 방향"
                                )
                        ),

                        "required", new String[]{
                                "aiTrend",
                                "aiManagementGuide"
                        },

                        "additionalProperties", false
                )
        );

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-5-mini",
                "input", prompt,
                "text", Map.of(
                        "format", responseFormat
                )
        );

        String responseBody;

        try {

            responseBody = restClient.post()
                    .uri("/responses")
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

        } catch (Exception e) {

            throw new CustomException(
                    ErrorCode.OPENAI_REQUEST_FAILED
            );
        }

        return parseReportResponse(responseBody);
    }

    /**
     * OpenAI Responses API 응답에서
     * 리포트 AI 분석 결과 추출
     */
    private ReportAiResponse parseReportResponse(
            String responseBody
    ) {

        try {

            JsonNode root =
                    objectMapper.readTree(responseBody);

            JsonNode output = root.get("output");

            if (output == null || !output.isArray()) {
                throw new CustomException(
                        ErrorCode.OPENAI_RESPONSE_NOT_FOUND
                );
            }

            for (JsonNode outputItem : output) {

                if (!"message".equals(
                        outputItem.path("type").asText()
                )) {
                    continue;
                }

                JsonNode content =
                        outputItem.get("content");

                if (content == null || !content.isArray()) {
                    continue;
                }

                for (JsonNode contentItem : content) {

                    if (!"output_text".equals(
                            contentItem.path("type").asText()
                    )) {
                        continue;
                    }

                    String jsonText =
                            contentItem.path("text").asText();

                    return objectMapper.readValue(
                            jsonText,
                            ReportAiResponse.class
                    );
                }
            }

            throw new CustomException(
                    ErrorCode.OPENAI_RESPONSE_NOT_FOUND
            );

        } catch (CustomException e) {
            throw e;
        }
        catch (Exception e) {
            throw new CustomException(
                    ErrorCode.OPENAI_RESPONSE_PARSE_FAILED
            );
        }
    }

    /**
     * 음성(STT 결과)를 입덧 기록 JSON으로 변환
     */
    public VoiceStructuredResponse analyzeVoice(String text) {

        Map<String, Object> responseFormat = Map.of(
                "type", "json_schema",
                "name", "voice_record",
                "description", "입덧 음성 기록을 구조화한 결과",
                "strict", true,
                "schema", Map.of(
                        "type", "object",
                        "properties", Map.of(

                                "timeCategory", Map.of(
                                        "type", "string",
                                        "description", "시간대 (아침, 점심, 저녁, 새벽)"
                                ),

                                "intensity", Map.of(
                                        "type", "integer",
                                        "description", "입덧 강도(1~5)"
                                ),

                                "memo", Map.of(
                                        "type", "string",
                                        "description", "사용자가 말한 내용을 자연스럽게 정리한 메모"
                                )

                        ),

                        "required", new String[]{
                                "timeCategory",
                                "intensity",
                                "memo"
                        },

                        "additionalProperties", false
                )
        );

        String prompt = """
            당신은 임신 중 입덧 기록을 정리하는 AI입니다.

            아래 STT 결과를 분석하여
            입덧 기록 화면에 자동 입력할 JSON만 생성하세요.

            규칙

            - timeCategory는
              아침 / 점심 / 저녁 / 새벽 중 하나만 선택

            - intensity는
              1~5 숫자로 반환

            - memo는
              사용자가 말한 내용을
              자연스러운 한 문장으로 정리

            STT 결과

            """ + text;

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-5-mini",
                "input", prompt,
                "text", Map.of(
                        "format", responseFormat
                )
        );

        String responseBody;

        try {

            responseBody = restClient.post()
                    .uri("/responses")
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

        } catch (Exception e) {

            throw new CustomException(
                    ErrorCode.OPENAI_REQUEST_FAILED
            );
        }

        return parseVoiceResponse(responseBody);
    }

    private VoiceStructuredResponse parseVoiceResponse(String responseBody) {

        try {

            JsonNode root = objectMapper.readTree(responseBody);

            JsonNode output = root.get("output");

            if (output == null || !output.isArray()) {
                throw new CustomException(
                        ErrorCode.OPENAI_RESPONSE_NOT_FOUND
                );
            }

            for (JsonNode outputItem : output) {

                if (!"message".equals(
                        outputItem.path("type").asText()
                )) {
                    continue;
                }

                JsonNode content = outputItem.get("content");

                if (content == null || !content.isArray()) {
                    continue;
                }

                for (JsonNode contentItem : content) {

                    if (!"output_text".equals(
                            contentItem.path("type").asText()
                    )) {
                        continue;
                    }

                    String jsonText =
                            contentItem.path("text").asText();

                    return objectMapper.readValue(
                            jsonText,
                            VoiceStructuredResponse.class
                    );
                }
            }

            throw new CustomException(
                    ErrorCode.OPENAI_RESPONSE_NOT_FOUND
            );

        } catch (CustomException e) {
            throw e;
        }
        catch (Exception e) {
            throw new CustomException(
                    ErrorCode.OPENAI_RESPONSE_PARSE_FAILED
            );
        }
    }
}