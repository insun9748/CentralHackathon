package com.nausealab.deotlog.user.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nausealab.deotlog.global.exception.CustomException;
import com.nausealab.deotlog.global.exception.ErrorCode;
import com.nausealab.deotlog.global.response.ApiResponse;
import com.nausealab.deotlog.global.security.CustomUserDetails;
import com.nausealab.deotlog.user.dto.request.UpdateProfileRequest;
import com.nausealab.deotlog.user.dto.request.UpdateUserSettingRequest;
import com.nausealab.deotlog.user.dto.response.UserProfileResponse;
import com.nausealab.deotlog.user.dto.response.UserSettingResponse;
import com.nausealab.deotlog.user.service.UserService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final ObjectMapper objectMapper;
    private final Validator validator;

    /**
     * 마이페이지 프로필 조회
     */
    @GetMapping("/me")
    public ApiResponse<UserProfileResponse> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ApiResponse.success(
                "프로필 조회에 성공했습니다.",
                userService.getProfile(userDetails.getUserId())
        );
    }

    /**
     * 프로필 수정
     */
    @PatchMapping(
            value = "/me",
            consumes = "multipart/form-data"
    )
    public ApiResponse<Void> updateProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestPart("request") String request,
            @RequestPart(value = "profileImage", required = false)
            MultipartFile profileImage
    ) {

        UpdateProfileRequest dto;

        try {
            dto = objectMapper.readValue(
                    request,
                    UpdateProfileRequest.class
            );
        } catch (JsonProcessingException e) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        Set<ConstraintViolation<UpdateProfileRequest>> violations =
                validator.validate(dto);

        if (!violations.isEmpty()) {
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        userService.updateProfile(
                userDetails.getUserId(),
                dto,
                profileImage
        );

        return ApiResponse.success("회원 정보가 수정되었습니다.");
    }

    /**
     * 설정 조회
     */
    @GetMapping("/me/settings")
    public ApiResponse<UserSettingResponse> getSetting(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ApiResponse.success(
                "설정 조회에 성공했습니다.",
                userService.getUserSetting(userDetails.getUserId())
        );
    }

    /**
     * 설정 수정
     */
    @PatchMapping("/me/settings")
    public ApiResponse<Void> updateSetting(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateUserSettingRequest request
    ) {

        userService.updateUserSetting(
                userDetails.getUserId(),
                request
        );

        return ApiResponse.success("설정이 수정되었습니다.");
    }
}