package com.nausealab.deotlog.auth.controller;

import com.nausealab.deotlog.auth.dto.request.LoginRequest;
import com.nausealab.deotlog.auth.dto.request.LogoutRequest;
import com.nausealab.deotlog.auth.dto.request.ReissueRequest;
import com.nausealab.deotlog.auth.dto.request.SignupRequest;
import com.nausealab.deotlog.auth.dto.response.AccessTokenResponse;
import com.nausealab.deotlog.auth.dto.response.TokenResponse;
import com.nausealab.deotlog.auth.service.AuthService;
import com.nausealab.deotlog.global.response.ApiResponse;
import com.nausealab.deotlog.global.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 회원가입
     */
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Void> signup(
            @Valid @RequestBody SignupRequest request
    ) {

        authService.signup(request);

        return ApiResponse.success(
                "회원가입이 완료되었습니다."
        );
    }

    /**
     * 로그인
     */
    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        TokenResponse response =
                authService.login(request);

        return ApiResponse.success(
                "로그인 성공",
                response
        );
    }

    /**
     * Access Token 재발급
     */
    @PostMapping("/reissue")
    public ApiResponse<AccessTokenResponse> reissue(
            @Valid @RequestBody ReissueRequest request
    ) {

        AccessTokenResponse response =
                authService.reissue(request);

        return ApiResponse.success(
                "Access Token이 재발급되었습니다.",
                response
        );
    }

    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody LogoutRequest request
    ) {

        authService.logout(
                userDetails.getUserId(),
                request
        );

        return ApiResponse.success(
                "로그아웃되었습니다."
        );
    }
}