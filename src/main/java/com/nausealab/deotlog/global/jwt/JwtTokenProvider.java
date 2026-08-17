package com.nausealab.deotlog.global.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.time.LocalDateTime;

@Component
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    private SecretKey secretKey;

    public JwtTokenProvider(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    @PostConstruct
    protected void init() {
        secretKey = Keys.hmacShaKeyFor(
                jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8)
        );
    }

    /**
     * Access Token 생성
     */
    public String createAccessToken(Long userId) {

        Date now = new Date();

        Date expiredAt = new Date(
                now.getTime() + jwtProperties.getAccessTokenExpiration()
        );

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(now)
                .expiration(expiredAt)
                .signWith(secretKey)
                .compact();
    }

    public LocalDateTime getAccessTokenExpiredAt() {

        return LocalDateTime.now()
                .plusNanos(jwtProperties.getAccessTokenExpiration() * 1_000_000);

    }

    /**
     * Refresh Token 생성
     */
    public String createRefreshToken(Long userId) {

        Date now = new Date();

        Date expiredAt = new Date(
                now.getTime() + jwtProperties.getRefreshTokenExpiration()
        );

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(now)
                .expiration(expiredAt)
                .signWith(secretKey)
                .compact();
    }

    public LocalDateTime getRefreshTokenExpiredAt() {

        return LocalDateTime.now()
                .plusNanos(jwtProperties.getRefreshTokenExpiration() * 1_000_000);

    }

    /**
     * 사용자 ID 추출
     */
    public Long getUserId(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return Long.parseLong(claims.getSubject());
    }

    /**
     * 토큰 유효성 검사
     */
    public boolean validateToken(String token) {

        try {

            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (Exception e) {
            return false;
        }
    }


    

}