package com.nausealab.deotlog.record.service;

import com.nausealab.deotlog.record.dto.response.VoiceRecordResponse;
import org.springframework.web.multipart.MultipartFile;

public interface VoiceRecordService {

    VoiceRecordResponse convertVoiceToRecord(MultipartFile audio);

}
