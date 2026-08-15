import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/tracker/scss/tracker_detail.scss';

// 뒤로가기 아이콘 import
import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';

function TrackerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. 수정 모드 여부 상태 (true: 수정 중, false: 조회 중)
  const [isEditing, setIsEditing] = useState(false);

  // 2. 상세 데이터 상태
  const [detailData, setDetailData] = useState({
    date: '2026.08.10',
    timeRange: '저녁 | 18:00~00:00',
    intensity: '4(심함)',
    triggers: ['김치'],
    type: '음식',
    originalText:
      '저녁을 먹으면서 김치를 같이 먹었는데 김치 냄새와 맛 때문인지 속이 갑자기 미식거렸다. 계속 속이 불편해서 저녁을 제대로 먹지 못해서 힘들었다.',
    analysis: {
      cause: '김치',
      symptomSummary: '미식거림',
      nauseaType: '음식',
      reliefFactor: '발견되지 않음',
      situation: '저녁 식사 중',
      condition: '속이 불편해 식사 어려움',
    },
  });

  // 3. 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setDetailData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAnalysisChange = (field, value) => {
    setDetailData((prev) => ({
      ...prev,
      analysis: {
        ...prev.analysis,
        [field]: value,
      },
    }));
  };

  // 4. 유발원인(태그) 문자열 수정용 (쉼표로 구분)
  const handleTriggerChange = (e) => {
    const tagArray = e.target.value.split(',').map((t) => t.trim());
    setDetailData((prev) => ({
      ...prev,
      triggers: tagArray,
    }));
  };

  // 5. 완료(저장) 버튼 클릭 시
  const handleSave = () => {
    setIsEditing(false);
    // [나중에 백엔드 API 연동 자리]: axios.put(`/api/tracker/${id}`, detailData)
  };

  return (
    <div className="tracker_detail_wrap">
      {/* 상단 뒤로가기 헤더 */}
      <header className="tracker_detail_header">
        <img
          src={arrowLeftIcon}
          alt="뒤로가기"
          className="tracker_detail_back_btn"
          onClick={() => navigate(-1)}
        />
        <h2 className="tracker_detail_title">
            입덧기록 상세
        </h2>
      </header>

      <main className="tracker_detail_body">
        {/* 1. 기본 정보 카드 */}
        <section className="tracker_detail_card info_card">
          <div className="tracker_row">
            <span className="tracker_label">일자</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={detailData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{detailData.date}</span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_label">시간대</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={detailData.timeRange}
                onChange={(e) => handleInputChange('timeRange', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{detailData.timeRange}</span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_label">입덧강도</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={detailData.intensity}
                onChange={(e) => handleInputChange('intensity', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{detailData.intensity}</span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_label">유발원인</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={detailData.triggers.join(', ')}
                onChange={handleTriggerChange}
                placeholder="쉼표(,)로 구분"
              />
            ) : (
              <div className="tracker_tag_group">
                {detailData.triggers.map((tag, idx) => (
                  <span key={idx} className="tracker_cause_tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_label">입덧유형</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={detailData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{detailData.type}</span>
            )}
          </div>
        </section>

        {/* 2. 기록 원문 카드 */}
        <section className="tracker_detail_card original_card">
          <h4 className="tracker_card_subtitle">기록 원문</h4>
          {isEditing ? (
            <textarea
              className="tracker_edit_textarea"
              value={detailData.originalText}
              onChange={(e) => handleInputChange('originalText', e.target.value)}
              rows={4}
            />
          ) : (
            <p className="tracker_original_content">{detailData.originalText}</p>
          )}
        </section>

        {/* 3. 분석 요약 카드 */}
        <section className="tracker_detail_card analysis_card">
          <div className="tracker_row">
            <span className="tracker_mint_label">입덧 유발 요인</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={detailData.analysis.cause}
                onChange={(e) => handleAnalysisChange('cause', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{detailData.analysis.cause}</span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_mint_label">증상 요약</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={detailData.analysis.symptomSummary}
                onChange={(e) => handleAnalysisChange('symptomSummary', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{detailData.analysis.symptomSummary}</span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_mint_label">입덧 유형</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={detailData.analysis.nauseaType}
                onChange={(e) => handleAnalysisChange('nauseaType', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{detailData.analysis.nauseaType}</span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_mint_label">완화 요인</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={detailData.analysis.reliefFactor}
                onChange={(e) => handleAnalysisChange('reliefFactor', e.target.value)}
              />
            ) : (
              <span
                className={`tracker_value ${
                  detailData.analysis.reliefFactor === '발견되지 않음' ? 'relief_gray' : ''
                }`}
              >
                {detailData.analysis.reliefFactor}
              </span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_mint_label">발생 상황</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={detailData.analysis.situation}
                onChange={(e) => handleAnalysisChange('situation', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{detailData.analysis.situation}</span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_mint_label">감정 및 컨디션</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={detailData.analysis.condition}
                onChange={(e) => handleAnalysisChange('condition', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{detailData.analysis.condition}</span>
            )}
          </div>
        </section>

        {/* 하단 수정하기 / 저장 버튼 */}
        <div className="tracker_button_container">
          {isEditing ? (
            <button type="button" className="tracker_save_button" onClick={handleSave}>
              수정완료
            </button>
          ) : (
            <button
              type="button"
              className="tracker_edit_button"
              onClick={() => setIsEditing(true)}
            >
              수정하기
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default TrackerDetail;