package com.nausealab.deotlog.global.security;

import com.nausealab.deotlog.user.entity.User;
import com.nausealab.deotlog.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * 이메일을 이용하여 사용자 조회
     */
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("존재하지 않는 사용자입니다."));

        return new CustomUserDetails(user);
    }

    /**
     * JWT에서 추출한 userId로 사용자 조회
     */
    public UserDetails loadUserByUserId(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UsernameNotFoundException("존재하지 않는 사용자입니다."));

        return new CustomUserDetails(user);
    }
}