package com.nausealab.deotlog.user.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class UpdateProfileRequest {

    @NotBlank
    private String nickname;

    @NotNull
    @Min(1)
    @Max(40)
    private Integer pregnancyWeek;

    @NotNull
    private LocalDate dueDate;
}