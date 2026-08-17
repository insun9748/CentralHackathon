package com.nausealab.deotlog.auth.service;

import com.nausealab.deotlog.auth.dto.request.LoginRequest;
import com.nausealab.deotlog.auth.dto.request.LogoutRequest;
import com.nausealab.deotlog.auth.dto.request.ReissueRequest;
import com.nausealab.deotlog.auth.dto.request.SignupRequest;
import com.nausealab.deotlog.auth.dto.response.AccessTokenResponse;
import com.nausealab.deotlog.auth.dto.response.TokenResponse;
import com.nausealab.deotlog.global.exception.CustomException;
import com.nausealab.deotlog.global.exception.ErrorCode;
import com.nausealab.deotlog.global.jwt.JwtTokenProvider;
import com.nausealab.deotlog.user.entity.User;
import com.nausealab.deotlog.user.entity.UserSetting;
import com.nausealab.deotlog.user.repository.UserRepository;
import com.nausealab.deotlog.user.repository.UserSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserSettingRepository userSettingRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public void signup(SignupRequest request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new CustomException(ErrorCode.PASSWORD_MISMATCH);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        UserSetting userSetting = UserSetting.builder()
                .user(user)
                .recordNotification(true)
                .reportNotification(true)
                .microphone(false)
                .build();

        userSettingRepository.save(userSetting);
    }

    @Override
    @Transactional
    public TokenResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new CustomException(ErrorCode.INVALID_LOGIN));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new CustomException(ErrorCode.INVALID_LOGIN);
        }

        String accessToken =
                jwtTokenProvider.createAccessToken(user.getUserId());

        String refreshToken =
                jwtTokenProvider.createRefreshToken(user.getUserId());

        user.updateRefreshToken(
                refreshToken,
                jwtTokenProvider.getRefreshTokenExpiredAt()
        );

        return new TokenResponse(
                accessToken,
                refreshToken
        );
    }

    @Override
    @Transactional
    public AccessTokenResponse reissue(ReissueRequest request) {

        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        User user = userRepository.findByRefreshToken(request.getRefreshToken())
                .orElseThrow(() ->
                        new CustomException(ErrorCode.INVALID_REFRESH_TOKEN));

        String accessToken =
                jwtTokenProvider.createAccessToken(user.getUserId());

        return new AccessTokenResponse(accessToken);
    }

    @Override
    @Transactional
    public void logout(Long userId, LogoutRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.UNAUTHORIZED));

        if (user.getRefreshToken() == null ||
                !user.getRefreshToken().equals(request.getRefreshToken())) {

            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        user.clearRefreshToken();
    }
}