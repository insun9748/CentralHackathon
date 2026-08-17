import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/tracker/scss/tracker_week.scss';

import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';
import { getTracker } from '../../api/tracker.js';
import { getErrorMessage } from '../../api/client.js';


function Tracker_week() {
    const navigate = useNavigate();

    const [weekData, setWeekData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        getTracker()
            .then((data) => {
                if (cancelled) return;
                setWeekData({
                    week: data.currentWeek,
                    stage: data.stage,
                    sections: [
                        { id: 'caution', emoji: '⚠️', title: '이번 주 주의사항', text: data.caution },
                        { id: 'foodInfo', emoji: '🥗', title: '음식 정보', text: data.foodInfo },
                        { id: 'bodyChange', emoji: '🤰', title: '이런 변화가 나타나요', text: data.bodyChange },
                    ],
                });
            })
            .catch((err) => {
                if (!cancelled) setError(getErrorMessage(err, '임신 주차 정보를 불러오지 못했습니다.'));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className='tracker_week_wrap'>
            <header className="tracker_week_header">
                <img
                    src={arrowLeftIcon}
                    alt="뒤로가기"
                    className="tracker_week_back_btn"
                    onClick={() => navigate(-1)}
                />
                <h2 className="tracker_week_title">
                    이번주 임신정보
                </h2>
            </header>

            {loading && <p className="record_empty_text">불러오는 중...</p>}
            {error && <p className="record_empty_text">{error}</p>}

            {weekData && (
                <>
                    <div className="tracker_week_heading">
                        <h1 className="week_title">임신 {weekData.week}주차</h1>
                        <p className="week_sub">{weekData.stage}</p>
                    </div>

                    <main className="tracker_week_content">
                        {weekData.sections.map((section) => (
                            <section key={section.id} className="week_info_card">
                                <div className="week_card_header">
                                    <span className="week_card_emoji">{section.emoji}</span>
                                    <h3 className="week_card_title">{section.title}</h3>
                                </div>

                                <div className="week_card_body">
                                    <div className="week_info_item">
                                        <p className="week_item_desc">{section.text}</p>
                                    </div>
                                </div>
                            </section>
                        ))}

                        <a href="https://www.childcare.go.kr/?menuno=363">출처: 아이사랑 웹사이트 &gt;
                        </a>
                    </main>
                </>
            )}
        </div>
    )
}

export default Tracker_week
