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
    date: '2026.08.16',
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



  // 3일 이내인지 확인하는 헬퍼 함수
  const canEdit = isEditableWithin3Days(detailData.date);

  function isEditableWithin3Days(recordDateStr) {
    if (!recordDateStr) return false;
    const recordDate = new Date(recordDateStr.replace(/\./g, '-'));
    const today = new Date();
    recordDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - recordDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 3;
  }

  const handleEdit = () => {
    navigate(`/tracker/edit/${id}`);
  };

  // 삭제하기 핸들러
  const handleDelete = () => {
    if (window.confirm('기록을 삭제하시겠습니까?')) {
      // axios.delete(`/api/tracker/${id}`)
      alert('삭제되었습니다.');
      navigate('/tracker');
    }
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
                className={`tracker_value ${detailData.analysis.reliefFactor === '발견되지 않음' ? 'relief_gray' : ''
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

        {/* 하단 버튼 영역 (조건부 렌더링) */}
        <div className="tracker_detail_btn_group">
          {/* 3일 이내일 때만 수정하기 버튼 렌더링 */}
          {canEdit && (
            <button
              type="button"
              className="tracker_btn_edit"
              onClick={handleEdit}
            >
              수정하기
            </button>
          )}

          {/* 삭제 버튼은 항상 표시 */}
          <button
            type="button"
            className="tracker_btn_delete"
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      </main>
    </div>
  );
}

export default TrackerDetail;