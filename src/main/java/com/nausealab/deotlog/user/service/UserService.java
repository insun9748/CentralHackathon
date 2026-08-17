package com.nausealab.deotlog.user.service;

import com.nausealab.deotlog.user.dto.request.UpdateProfileRequest;
import com.nausealab.deotlog.user.dto.request.UpdateUserSettingRequest;
import com.nausealab.deotlog.user.dto.response.UserProfileResponse;
import com.nausealab.deotlog.user.dto.response.UserSettingResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    UserProfileResponse getProfile(
            Long userId
    );

    void updateProfile(
            Long userId,
            UpdateProfileRequest request,
            MultipartFile profileImage
    );

    UserSettingResponse getUserSetting(
            Long userId
    );

    void updateUserSetting(
            Long userId,
            UpdateUserSettingRequest request
    );
}