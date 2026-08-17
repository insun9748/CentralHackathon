package com.nausealab.deotlog.user.service;

import com.nausealab.deotlog.global.exception.CustomException;
import com.nausealab.deotlog.global.exception.ErrorCode;
import com.nausealab.deotlog.user.dto.request.UpdateProfileRequest;
import com.nausealab.deotlog.user.dto.request.UpdateUserSettingRequest;
import com.nausealab.deotlog.user.dto.response.UserProfileResponse;
import com.nausealab.deotlog.user.dto.response.UserSettingResponse;
import com.nausealab.deotlog.user.entity.User;
import com.nausealab.deotlog.user.entity.UserSetting;
import com.nausealab.deotlog.user.repository.UserRepository;
import com.nausealab.deotlog.user.repository.UserSettingRepository;
import com.nausealab.deotlog.user.util.PregnancyWeekCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private static final Path UPLOAD_DIR =
            Paths.get(System.getProperty("user.dir"), "uploads", "profile");

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    private final UserRepository userRepository;
    private final UserSettingRepository userSettingRepository;
    private final PregnancyWeekCalculator pregnancyWeekCalculator;

    @Override
    @Transactional
    public UserProfileResponse getProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.USER_NOT_FOUND));

        if (user.getDueDate() != null) {

            int currentWeek =
                    pregnancyWeekCalculator.calculate(user.getDueDate());

            if (!currentWeekEquals(user, currentWeek)) {
                user.updatePregnancyWeek(currentWeek);
            }
        }

        return UserProfileResponse.builder()
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .pregnancyWeek(user.getPregnancyWeek())
                .dueDate(user.getDueDate())
                .build();
    }

    private boolean currentWeekEquals(
            User user,
            int currentWeek
    ) {
        return user.getPregnancyWeek() != null
                && user.getPregnancyWeek().equals(currentWeek);
    }

    @Override
    @Transactional
    public void updateProfile(
            Long userId,
            UpdateProfileRequest request,
            MultipartFile profileImage
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.USER_NOT_FOUND));

        String imagePath = user.getProfileImage();

        int calculatedWeek =
                pregnancyWeekCalculator.calculate(request.getDueDate());

        if (!request.getPregnancyWeek().equals(calculatedWeek)) {
            throw new CustomException(
                    ErrorCode.INVALID_PREGNANCY_INFO
            );
        }

        if (profileImage != null && !profileImage.isEmpty()) {
            imagePath = saveProfileImage(profileImage, imagePath);
        }

        user.updateProfile(
                request.getNickname(),
                request.getPregnancyWeek(),
                request.getDueDate(),
                imagePath
        );
    }

    @Override
    public UserSettingResponse getUserSetting(Long userId) {

        UserSetting setting = userSettingRepository
                .findByUser_UserId(userId)
                .orElseThrow(() ->
                        new CustomException(
                                ErrorCode.USER_SETTING_NOT_FOUND
                        )
                );

        return UserSettingResponse.builder()
                .recordNotification(
                        setting.getRecordNotification()
                )
                .reportNotification(
                        setting.getReportNotification()
                )
                .microphone(
                        setting.getMicrophone()
                )
                .build();
    }

    @Override
    @Transactional
    public void updateUserSetting(
            Long userId,
            UpdateUserSettingRequest request
    ) {

        UserSetting setting = userSettingRepository
                .findByUser_UserId(userId)
                .orElseThrow(() ->
                        new CustomException(
                                ErrorCode.USER_SETTING_NOT_FOUND
                        )
                );

        setting.update(
                request.getRecordNotification(),
                request.getReportNotification(),
                request.getMicrophone()
        );
    }

    private String saveProfileImage(
            MultipartFile file,
            String oldImagePath
    ) {

        try {

            if (!Files.exists(UPLOAD_DIR)) {
                Files.createDirectories(UPLOAD_DIR);
            }

            String contentType = file.getContentType();

            if (contentType == null ||
                    !contentType.startsWith("image/")) {
                throw new CustomException(
                        ErrorCode.INVALID_IMAGE_TYPE
                );
            }

            String extension =
                    StringUtils.getFilenameExtension(
                            file.getOriginalFilename()
                    );

            if (extension == null) {
                throw new CustomException(
                        ErrorCode.INVALID_IMAGE_EXTENSION
                );
            }

            extension = extension.toLowerCase();

            if (!ALLOWED_EXTENSIONS.contains(extension)) {
                throw new CustomException(
                        ErrorCode.INVALID_IMAGE_EXTENSION
                );
            }

            if (file.getSize() > MAX_FILE_SIZE) {
                throw new CustomException(
                        ErrorCode.IMAGE_SIZE_EXCEEDED
                );
            }

            if (oldImagePath != null &&
                    !oldImagePath.isBlank()) {

                String oldFileName =
                        Paths.get(oldImagePath)
                                .getFileName()
                                .toString();

                Path oldPath =
                        UPLOAD_DIR.resolve(oldFileName);

                Files.deleteIfExists(oldPath);
            }

            String fileName =
                    UUID.randomUUID() + "." + extension;

            Path targetPath =
                    UPLOAD_DIR.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/profile/" + fileName;

        } catch (IOException e) {
            throw new CustomException(
                    ErrorCode.PROFILE_IMAGE_SAVE_FAILED
            );
        }
    }

}