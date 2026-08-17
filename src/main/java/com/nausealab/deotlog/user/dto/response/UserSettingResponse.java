package com.nausealab.deotlog.user.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserSettingResponse {

    private Boolean recordNotification;

    private Boolean reportNotification;

    private Boolean microphone;

}