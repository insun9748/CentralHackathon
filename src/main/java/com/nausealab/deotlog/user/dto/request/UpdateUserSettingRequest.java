package com.nausealab.deotlog.user.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateUserSettingRequest {

    @NotNull
    private Boolean recordNotification;

    @NotNull
    private Boolean reportNotification;

    @NotNull
    private Boolean microphone;

}