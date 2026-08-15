import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/tracker/scss/tracker_week.scss';

import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';


function Tracker_week() {
    const navigate = useNavigate();
    const { week } = useParams(); // URL 파라미터로 주차가 넘어오는 경우 활용 가능

    // 백엔드에서 받아올 데이터 상태 정의 (초기 더미 구조)
    const [weekData, setWeekData] = useState({
        week: 9,
        stage: '임신 초기 : 1~13주',
        sections: [
            {
                id: 'nutrition',
                emoji: '🥗',
                title: '임신초기 영양관리',
                items: [
                    {
                        id: 1,
                        subject: '철분',
                        description:
                            '태아의 성장에 철분의 요구량이 늘어나기 때문에 철분이 풍부한 음식을 섭취하는 것이 좋아요',
                        highlight: '조개류, 쇠간, 쇠고기, 돼지고기, 계란 노른자, 푸른 잎채소 등',
                    },
                    {
                        id: 2,
                        subject: '비타민C',
                        description:
                            '비타민C는 태아의 신진대사에 관여하는 철분의 흡수를 도와줘요',
                        highlight: '풋고추, 시금치, 열무김치, 딸기, 오렌지, 토마토 등',
                    },
                    {
                        id: 3,
                        subject: '엽산제',
                        description:
                            '임신 전부터 임신 12~14주까지 꾸준히 복용하는 것이 좋아요',
                    },
                    {
                        id: 4,
                        subject: '충분한 물',
                        description:
                            '입덧으로 자주 토하다보면 수분부족이 일어나기 쉬워 충분한 수분보충이 필요해요',
                    },
                ],
            },
            {
                id: 'precautions',
                emoji: '⚠️',
                title: '식생활 주의사항',
                items: [
                    {
                        id: 1,
                        subject: '카페인 섭취를 줄여주세요',
                        description: '카페인을 과다하게 섭취하는 것에 주의해 주세요',
                    },
                    {
                        id: 2,
                        subject: '적절한 체중증가가 필요해요',
                        description: '비 임신시에 비해 100~300Kcal정도의 추가 섭취가 필요해요',
                    },
                    {
                        id: 3,
                        subject: '약물은 상담 후 복용하세요',
                        description: '임신 중 약물을 복용할 때는 의사와 상담이 필요해요',
                    },
                ],
            },
            {
                id: 'changes',
                emoji: '🤰',
                title: '이런변화가 나타나요',
                items: [
                    {
                        id: 1,
                        subject: '유방 변화가 두드러져요',
                        description: '유방의 변화가 한층 두드러지게 나타날 수 있어요',
                    },
                    {
                        id: 2,
                        subject: '입덧이 나타날 수 있어요',
                        description:
                            '지금까지 입덧을 못 느꼈던 임신부도 대부분 입덧을 느낄 수 있어요',
                    },
                    {
                        id: 3,
                        subject: '침과 트림이 많아질 수 있어요',
                        description:
                            '침의 양이 증가하고 위와 십이지장의 운동성이 떨어져 음식물이 위에서 발효되기 때문에 침과 트림이 많이 나와요',
                    },
                    {
                        id: 4,
                        subject: '하복부가 당기거나 요통이 생길 수 있어요',
                        description:
                            '자궁의 크기가 점차 주먹만하게 커지면서 하복부가 당기거나 요통이 올 수 있어요',
                    },
                ],
            },
        ],
    });

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
                            {section.items?.map((item) => (
                                <div key={item.id} className="week_info_item">
                                    <h4 className="week_item_subject">{item.subject}</h4>
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

            

        </div>
    )
}

export default Tracker_week
