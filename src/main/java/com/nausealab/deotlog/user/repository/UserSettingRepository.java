package com.nausealab.deotlog.user.repository;

import com.nausealab.deotlog.user.entity.UserSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSettingRepository
        extends JpaRepository<UserSetting, Long> {

    Optional<UserSetting> findByUser_UserId(Long userId);

}