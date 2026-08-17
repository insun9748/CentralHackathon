import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/MyPage/scss/mypage.scss';

import defaultProfileImg from '../../assets/MyPage/img/mypage.svg';
import edit from '../../assets/MyPage/img/mypage_edit.svg';
import notification from '../../assets/MyPage/img/mypage_notification.svg';
import authority from '../../assets/MyPage/img/mypage_authority.svg';
import logout from '../../assets/MyPage/img/mypage_logout.svg';
import arrow from '../../assets/Mypage/img/arrow.svg';
import { getMe } from '../../api/user.js';
import { logout as logoutApi } from '../../api/auth.js';
import { clearTokens, getRefreshToken } from '../../api/tokenStorage.js';
import { resolveMediaUrl, getErrorMessage } from '../../api/client.js';


function MyPage() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        profileImage: defaultProfileImg,
        nickname: '',
        pregnancyWeek: '',
        dueDate: '',
    });

    useEffect(() => {
        let cancelled = false;
        getMe()
            .then((data) => {
                if (cancelled) return;
                setUserData({
                    profileImage: resolveMediaUrl(data.profileImage) || defaultProfileImg,
                    nickname: data.nickname,
                    pregnancyWeek: data.pregnancyWeek,
                    dueDate: data.dueDate,
                });
            })
            .catch((err) => {
                console.error(getErrorMessage(err));
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const handleEdit = () => {
        navigate(`/mypage/edit`);

    };
    const handleLogout = async () => {
        try {
            const refreshToken = getRefreshToken();
            if (refreshToken) await logoutApi(refreshToken);
        } catch {
            // 서버 로그아웃이 실패해도 클라이언트 토큰은 지운다
        } finally {
            clearTokens();
            navigate('/');
        }
    };
    const handleNotification = () => {
        navigate('/mypage/notification');
    };
    const handleAuthority = () => {
        navigate('/mypage/authority');
    };


    return (
        <div className='mypage_wrap'>
            <div className="mypage_nav"></div>
            <div className="mypage_info">
                <img src={userData.profileImage} alt="" />
                <section>
                    <div className="mp_row">
                        <div className="mp_row_left">
                            <div className="mp_label">닉네임 | </div>
                            <div className="mp_value_nickname">{userData.nickname}</div>
                        </div>

                        <img src={edit} onClick={handleEdit} alt="" />
                    </div>
                    <div className="mp_row">
                        <div className="mp_row_left">
                            <div className="mp_label">주수 | </div>
                            <div className="mp_value">{userData.pregnancyWeek}</div>
                        </div>

                    </div>
                    <div className="mp_row">
                        <div className="mp_row_left">
                            <div className="mp_label">주수 | </div>
                            <div className="mp_value">{userData.dueDate}</div>
                        </div>

                    </div>
                </section>
            </div>
            <div className="mp_bot_bar"></div>

            <div className="mp_setting_title">앱 설정</div>
            <div className="mp_setting_detail">
                <div className="mp_st_left">
                    <img src={notification} alt="" />
                    <p>알림설정</p>
                </div>
                <img src={arrow} onClick={handleNotification} alt="" />
            </div>
            <div className="mp_setting_detail">
                <div className="mp_st_left">
                    <img src={authority} alt="" />
                    <p>권한설정</p>
                </div>
                <img src={arrow} onClick={handleAuthority} alt="" />
            </div>

            <div className="mp_logout" onClick={handleLogout}>
                <img src={logout} alt="" />
                <p>로그아웃</p>
            </div>

        </div>
    )
}

export default MyPage
