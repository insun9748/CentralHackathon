import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/MyPage/scss/mypage.scss';

import defaultProfileImg from '../../assets/MyPage/img/mypage.svg';
import edit from '../../assets/MyPage/img/mypage_edit.svg';
import notification from '../../assets/MyPage/img/mypage_notification.svg';
import authority from '../../assets/MyPage/img/mypage_authority.svg';
import logout from '../../assets/MyPage/img/mypage_logout.svg';
import arrow from '../../assets/Mypage/img/arrow.svg';


function MyPage() {
    const navigate = useNavigate();

    // 1. 백엔드에서 받아올 사용자 정보 상태 (초기 더미값)
    const [userData, setUserData] = useState({
        profileImage: defaultProfileImg,
        nickname: '다온',
        pregnancyWeek: 9,
        dueDate: '2027.03.27',
    });

    const handleEdit = () => {
        navigate(`/mypage/edit`);

    };
    const handleLogout = () => {
        navigate('/');
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
                <img src={defaultProfileImg} alt="" />
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
