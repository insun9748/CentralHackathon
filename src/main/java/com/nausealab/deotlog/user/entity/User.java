package com.nausealab.deotlog.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "User")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = true, length = 30)
    private String nickname;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "pregnancy_week")
    private Integer pregnancyWeek;

    @Column(name = "due_date", nullable = true)
    private LocalDate dueDate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "refresh_token", length = 500, unique = true)
    private String refreshToken;

    @Column(name = "refresh_token_expired_at")
    private LocalDateTime refreshTokenExpiredAt;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private UserSetting userSetting;

    @Builder
    public User(
            String email,
            String password
    ) {
        this.email = email;
        this.password = password;
    }
    /**
     * Refresh Token 저장
     */
    public void updateRefreshToken(
            String refreshToken,
            LocalDateTime refreshTokenExpiredAt
    ) {
        this.refreshToken = refreshToken;
        this.refreshTokenExpiredAt = refreshTokenExpiredAt;
    }

    /**
     * 로그아웃 시 Refresh Token 삭제
     */
    public void clearRefreshToken() {
        this.refreshToken = null;
        this.refreshTokenExpiredAt = null;
    }

    public void updateProfile(
            String nickname,
            Integer pregnancyWeek,
            LocalDate dueDate,
            String profileImage
    ) {
        this.nickname = nickname;
        this.pregnancyWeek = pregnancyWeek;
        this.dueDate = dueDate;
        this.profileImage = profileImage;
    }

    public void updatePregnancyWeek(Integer pregnancyWeek) {
        this.pregnancyWeek = pregnancyWeek;
    }
}