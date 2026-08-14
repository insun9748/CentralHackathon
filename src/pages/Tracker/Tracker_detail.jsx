import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';
import '../../assets/tracker/scss/tracker_detail.scss';

function Tracker_detail() {

    const { id } = useParams();
    const navigate = useNavigate();

    // 더미 상세 데이터 (백엔드 API 연동 자리)
    const [detailData, setDetailData] = useState({
        date: '2026.08.20',
        timeRange: '오전 | 06:00~12:00',
        intensity: '4(심함)',
        triggers: ['계란비린내', '계란'],
        type: '음식냄새',

        originalText:
            '오전에 일어나서부터 속이 메스꺼웠는데 아침에 계란볶음밥을 해먹었더니 계란 비린내가 역해서 토할 것 같은 기분이 들었다. 속이 울렁거려서 다 먹지 못하고 남겼다.',

        analysis: {
            cause: '계란볶음밥 → 계란 비린내',
            symptomSummary: '메스꺼움, 구역질',
            nauseaType: '음식 냄새',
            reliefFactor: '발견되지 않음',
            situation: '아침 식사 중',
            condition: '구역감, 기분저하',
        },
    });

    return (
        <div className='tracker_detail_wrap'>
            <div className="tracker_detail_header">
                <img src={arrowLeftIcon} onClick={() => navigate(-1)} className="tracker_detail_back_btn" />
                <h2 className='tracker_detail_title'>입덧기록 상세</h2>
            </div>

            <div className="tracker_detail_card">
                <div className="detail_card_1">

                    <div className="row">
                        <span className='tracker_label'>일자</span>
                        <span className='tracker_value'>{detailData.date}</span>
                    </div>
                    <div className="row">
                        <span className='tracker_label'>시간대</span>
                        <span className='tracker_value'>{detailData.timeRange}</span>
                    </div>
                    <div className="row">
                        <span className='tracker_label'>입덧강도</span>
                        <span className='tracker_value'>{detailData.intensity}</span>
                    </div>
                    <div className="row">
                        <span className='tracker_label'>유별원인</span>
                        <div className="tracker_tag_group">
                            {detailData.triggers.map((tag, idx) => (
                                <span key={idx} className="tracker_cause_tag">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="row">
                        <span className='tracker_label'>입덧유형</span>
                        <span className='tracker_value'>{detailData.type}</span>
                    </div>


                </div>

                <div className="detail_card_2">
                    <p className='tracker_label'>기록 원문</p>
                    <p className='tracker_value'>{detailData.originalText}</p>
                </div>

                <div className="detail_card_3">
                    <div className="row">
                        <span className='tracker_label'>입덧 유발 요인</span>
                        <span className='tracker_value'>{detailData.analysis.cause}</span>
                    </div>
                    <div className="row">
                        <span className='tracker_label'>증상 요약</span>
                        <span className='tracker_value'>{detailData.analysis.symptomSummary}</span>
                    </div>
                    <div className="row">
                        <span className='tracker_label'>입덧 유형</span>
                        <span className='tracker_value'>{detailData.analysis.nauseaType}</span>
                    </div>
                    <div className="row">
                        <span className='tracker_label'>완화 요인</span>
                        <span
                            className={`tracker_value ${detailData.analysis.reliefFactor === '발견되지 않음' ? 'relief_gray' : ''
                                }`}
                        >
                            {detailData.analysis.reliefFactor}
                        </span>
                    </div>
                    <div className="row">
                        <span className='tracker_label'>발생 상황</span>
                        <span className='tracker_value'>{detailData.analysis.situation}</span>
                    </div>
                    <div className="row">
                        <span className='tracker_label'>감정 및 컨디션</span>
                        <span className='tracker_value'>{detailData.analysis.condition}</span>
                    </div>
                </div>

            </div>

            <button className='tracker_detail_btn'>수정하기</button>
        </div>
    )
}

export default Tracker_detail
