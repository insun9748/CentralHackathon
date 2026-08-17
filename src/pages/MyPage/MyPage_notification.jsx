import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/MyPage/scss/mypage_notification.scss';
import time from '../../assets/MyPage/img/time.svg';
import report from '../../assets/MyPage/img/report.svg';
import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';
import { getSettings, updateSettings } from '../../api/user.js';
import { getErrorMessage } from '../../api/client.js';


function MyPage_notification() {
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        recordNotification: true,
        reportNotification: true,
        microphone: true,
    });
    const [loading, setLoading] = useState(true);

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

    const handleToggle = async (field, value) => {
        const next = { ...settings, [field]: value };
        setSettings(next);
        try {
            await updateSettings(next);
        } catch (err) {
            setSettings(settings);
            alert(getErrorMessage(err, '설정 변경에 실패했습니다.'));
        }
    };

    return (
        <div className='mypage_notification_wrap'>
            <header className="mypage_notification_header">
                <img
                    src={arrowLeftIcon}
                    alt="뒤로가기"
                    className="mypage_notification_back_btn"
                    onClick={() => navigate(-1)}
                />
                <h2 className="mypage_notification_title">권한설정</h2>
            </header>

            <main className="notification_list_section">


                {/* 입덧 기록 시간 */}
                <div className="notification_item">
                    <div className="notification_left">
                        <img src={time} alt="" className="notification_icon" />
                        <div className="nf_middle">
                            <span className="notification_label">입덧기록 시간</span>
                            <p>하루 중 기록이 없는 시간대를 알려줘요</p>
                        </div>
                    </div>
                    <label className="nf_toggle_switch">
                        <input
                            type="checkbox"
                            checked={settings.recordNotification}
                            disabled={loading}
                            onChange={(e) => handleToggle('recordNotification', e.target.checked)}
                        />
                        <span className="nf_slider round" />
                    </label>
                </div>

                {/* 리포트 생성 */}
                <div className="notification_item">
                    <div className="notification_left">
                        <img src={report} alt="" className="notification_icon" />
                        <div className="nf_middle">
                            <span className="notification_label">리포트 생성</span>
                            <p>리포트 생성이 가능하면 알림을 보내요</p>
                        </div>
                    </div>
                    <label className="nf_toggle_switch">
                        <input
                            type="checkbox"
                            checked={settings.reportNotification}
                            disabled={loading}
                            onChange={(e) => handleToggle('reportNotification', e.target.checked)}
                        />
                        <span className="nf_slider round" />
                    </label>
                </div>
            </main>
        </div>
    )
}

export default MyPage_notification
