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

        const fetchWeek = async () => {
            await Promise.resolve();
            if (cancelled) return;
            try {
                const data = await getTracker();
                if (cancelled) return;
                setWeekData({
                    week: data.currentWeek,
                    stage: data.stage,
                    sections: [
                        { id: 'foodInfo', emoji: '🥗', title: '임신초기 영양관리', items: data.foodInfo ?? [] },
                        { id: 'caution', emoji: '⚠️', title: '식생활 주의사항', items: data.caution ?? [] },
                        { id: 'bodyChange', emoji: '🤰', title: '이런변화가 나타나요', items: data.bodyChange ?? [] },
                    ],
                });
            } catch (err) {
                if (!cancelled) setError(getErrorMessage(err, '임신 주차 정보를 불러오지 못했습니다.'));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchWeek();
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

                    {/* 3. 본문 카드 목록 (sections 배열 map 순회) */}
                    <main className="tracker_week_content">
                        {weekData.sections?.map((section) => (
                            <section key={section.id} className="week_info_card">
                                {/* 카드 헤더 (이모지 + 제목) */}
                                <div className="week_card_header">
                                    <span className="week_card_emoji">{section.emoji}</span>
                                    <h3 className="week_card_title">{section.title}</h3>
                                </div>

                                {/* 카드 본문 (아이템 배열 map 순회) */}
                                <div className="week_card_body">
                                    {section.items?.map((item, idx) => (
                                        <div key={idx} className="week_info_item">
                                            <h4 className="week_item_subject">{item.title}</h4>
                                            <p className="week_item_desc">{item.description}</p>
                                            {item.highlight && (
                                                <p className="week_item_highlight">{item.highlight}</p>
                                            )}
                                        </div>
                                    ))}
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
