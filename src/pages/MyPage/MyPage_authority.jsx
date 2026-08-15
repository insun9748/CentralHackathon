import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/mypage/scss/mypage_authority.scss';

import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';
import micIcon from '../../assets/MyPage/img/mic.svg';
import privacyIcon from '../../assets/MyPage/img/personal.svg';
import termsIcon from '../../assets/MyPage/img/service.svg';

function MyPage_authority() {
  const navigate = useNavigate();

  // localStorage에서 마이크 권한 상태 가져오기 (기본값 true 또는 false)
  const [micPermission, setMicPermission] = useState(() => {
    return localStorage.getItem('mic_permission') !== 'false'; // 기본 허용 상태로 둘 경우
  });

  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(true);

  // 마이크 권한 토글 핸들러
  const handleMicToggle = async () => {
    if (!micPermission) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((track) => track.stop()); // 테스트용 스트림 즉시 종료

          setMicPermission(true);
          localStorage.setItem('mic_permission', 'true');
        } else {
          setMicPermission(true);
          localStorage.setItem('mic_permission', 'true');
        }
      } catch (error) {
        console.error('마이크 권한 획득 실패:', error);
        alert('브라우저 설정에서 마이크 접근을 허용해 주세요.');
        setMicPermission(false);
        localStorage.setItem('mic_permission', 'false');
      }
    } else {
      setMicPermission(false);
      localStorage.setItem('mic_permission', 'false');
    }
  };

  return (
    <div className="mypage_authority_wrap">
      <header className="mypage_authority_header">
        <img
          src={arrowLeftIcon}
          alt="뒤로가기"
          className="mypage_authority_back_btn"
          onClick={() => navigate(-1)}
        />
        <h2 className="mypage_authority_title">권한설정</h2>
      </header>

      <main className="authority_list_section">
        {/* 마이크 사용 권한 */}
        <div className="authority_item">
          <div className="at_item_left">
            <img src={micIcon}  className="at_item_icon" />
            <span className="at_item_label">마이크 사용 권한</span>
          </div>
          <label className="at_toggle_switch">
            <input
              type="checkbox"
              checked={micPermission}
              onChange={handleMicToggle}
            />
            <span className="slider round" />
          </label>
        </div>

        {/* 개인정보처리방침 */}
        <div className="authority_item">
          <div className="at_item_left">
            <img src={privacyIcon} alt="" className="at_item_icon" />
            <span className="at_item_label">개인정보처리방침</span>
          </div>
          <label className="at_toggle_switch">
            <input
              type="checkbox"
              checked={privacyAgreed}
              onChange={(e) => setPrivacyAgreed(e.target.checked)}
            />
            <span className="slider round" />
          </label>
        </div>

        {/* 서비스 이용약관 */}
        <div className="authority_item">
          <div className="at_item_left">
            <img src={termsIcon} alt="" className="at_item_icon" />
            <span className="at_item_label">서비스 이용약관</span>
          </div>
          <label className="at_toggle_switch">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
            />
            <span className="slider round" />
          </label>
        </div>
      </main>
    </div>
  );
}

export default MyPage_authority;