package com.nausealab.deotlog.auth.service;

import com.nausealab.deotlog.auth.dto.request.LoginRequest;
import com.nausealab.deotlog.auth.dto.request.LogoutRequest;
import com.nausealab.deotlog.auth.dto.request.ReissueRequest;
import com.nausealab.deotlog.auth.dto.request.SignupRequest;
import com.nausealab.deotlog.auth.dto.response.AccessTokenResponse;
import com.nausealab.deotlog.auth.dto.response.TokenResponse;

public interface AuthService {

    void signup(SignupRequest request);

    TokenResponse login(LoginRequest request);

    AccessTokenResponse reissue(ReissueRequest request);

    void logout(Long userId, LogoutRequest request);
}