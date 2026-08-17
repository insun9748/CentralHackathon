package com.nausealab.deotlog.ai.service;

import com.nausealab.deotlog.ai.dto.response.AiAnalysisResponse;

public interface AiService {

    AiAnalysisResponse analyzeRecord(
            Long recordId,
            Long userId
    );

}