package com.nausealab.deotlog.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "UserSetting")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_setting_id")
    private Long userSettingId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(name = "record_notification", nullable = false)
    private Boolean recordNotification;

    @Column(name = "report_notification", nullable = false)
    private Boolean reportNotification;

    @Column(nullable = false)
    private Boolean microphone;

    @Builder
    public UserSetting(
            User user,
            Boolean recordNotification,
            Boolean reportNotification,
            Boolean microphone
    ) {
        this.user = user;
        this.recordNotification =
                recordNotification != null
                        ? recordNotification
                        : true;

        this.reportNotification =
                reportNotification != null
                        ? reportNotification
                        : true;

        this.microphone =
                microphone != null
                        ? microphone
                        : false;
    }

    public void update(
            Boolean recordNotification,
            Boolean reportNotification,
            Boolean microphone
    ) {
        this.recordNotification = recordNotification;
        this.reportNotification = reportNotification;
        this.microphone = microphone;
    }
}