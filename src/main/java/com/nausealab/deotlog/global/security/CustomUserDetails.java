package com.nausealab.deotlog.global.security;

import com.nausealab.deotlog.user.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    /**
     * 권한 목록
     * 현재는 권한을 사용하지 않으므로 빈 리스트 반환
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    /**
     * 비밀번호
     */
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    /**
     * 로그인 아이디
     * 우리 프로젝트는 이메일 로그인
     */
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    /**
     * 사용자 PK
     */
    public Long getUserId() {
        return user.getUserId();
    }

    /**
     * 사용자 EMAIL
     */
    public String getEmail() {
        return user.getEmail();
    }

    /**
     * 닉네임
     */
    public String getNickname() {
        return user.getNickname();
    }

    /**
     * 계정 만료 여부
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 계정 잠금 여부
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * 비밀번호 만료 여부
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * 계정 활성화 여부
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}