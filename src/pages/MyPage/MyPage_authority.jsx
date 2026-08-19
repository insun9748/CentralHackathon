import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/MyPage/scss/mypage_authority.scss';

import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';
import micIcon from '../../assets/MyPage/img/mic.svg';
import privacyIcon from '../../assets/MyPage/img/personal.svg';
import termsIcon from '../../assets/MyPage/img/service.svg';
import { getSettings, updateSettings } from '../../api/user.js';
import { getErrorMessage } from '../../api/client.js';

function MyPage_authority() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    recordNotification: true,
    reportNotification: true,
    microphone: true,
  });
  const [loading, setLoading] = useState(true);

  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getSettings()
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch((err) => {
        alert(getErrorMessage(err, '설정을 불러오지 못했습니다.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateMicrophoneSetting = async (value) => {
    const next = { ...settings, microphone: value };
    setSettings(next);
    try {
      await updateSettings(next);
    } catch (err) {
      setSettings(settings);
      alert(getErrorMessage(err, '설정 변경에 실패했습니다.'));
    }
  };

  // 마이크 권한 토글 핸들러 (브라우저 권한 요청 + 서버 설정 동기화)
  const handleMicToggle = async () => {
    if (!settings.microphone) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((track) => track.stop()); // 테스트용 스트림 즉시 종료
        }
        await updateMicrophoneSetting(true);
      } catch (error) {
        console.error('마이크 권한 획득 실패:', error);
        alert('브라우저 설정에서 마이크 접근을 허용해 주세요.');
        await updateMicrophoneSetting(false);
      }
    } else {
      await updateMicrophoneSetting(false);
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
              checked={settings.microphone}
              disabled={loading}
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
