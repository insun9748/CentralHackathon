package com.nausealab.deotlog.user.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class UserProfileResponse {

    private String nickname;

    private String profileImage;

    private Integer pregnancyWeek;

    private LocalDate dueDate;

}