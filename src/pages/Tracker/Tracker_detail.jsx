import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import EmojiScale from '../../components/EmojiScale/EmojiScale.jsx'; // 이모지 스케일 컴포넌트 임포트 경로 확인
import '../../assets/tracker/scss/tracker_detail.scss';

// 뒤로가기 아이콘 import
import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';

// 카드에서 전달받은 기록이 없을 때 보여줄 기본값
const defaultDetailData = {
  date: '2026.08.16',
  timeRange: '오전 | 06:00~12:00',
  timeSlotKey: '오전',
  intensity: 4,
  triggers: ['계란비린내', '계란'],
  type: '음식냄새',
  originalText:
    '오전에 일어나서부터 속이 메스꺼웠는데 아침에 계란볶음밥을 해먹었더니 계란 비린내가 역해서 토할 것 같은 기분이 들었다. 속이 울렁거려서 다 먹지 못하고 남겼다.',
  analysis: {
    cause: '계란볶음밥 -> 계란 비린내',
    symptomSummary: '메스꺼움, 구역질',
    nauseaType: '음식 냄새',
    reliefFactor: '발견되지 않음',
    situation: '아침 식사 중',
    condition: '구역감, 기분저하',
  },
};

// 시간대 매핑 테이블
const TIME_SLOTS = [
  { label: '새벽', fullText: '새벽 | 00:00~06:00' },
  { label: '오전', fullText: '오전 | 06:00~12:00' },
  { label: '오후', fullText: '오후 | 12:00~18:00' },
  { label: '저녁', fullText: '저녁 | 18:00~24:00' },
];

// 입덧강도 텍스트 라벨 매핑 (0~5)
const INTENSITY_LABELS = {
  0: '0 | 없음',
  1: '1 | 약함',
  2: '2 | 보통',
  3: '3 | 약간심함',
  4: '4 | 심함',
  5: '5 | 매우심함',
};

function TrackerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 내부 임시 선택 상태
  const [tempTimeSlot, setTempTimeSlot] = useState('오전');
  const [tempIntensity, setTempIntensity] = useState(4);

  // 상세 데이터 상태
  const [detailData, setDetailData] = useState(() => {
    const passedRecord = location.state;
    if (!passedRecord) return defaultDetailData;

    return {
      ...defaultDetailData,
      timeRange: passedRecord.timeCategory ?? defaultDetailData.timeRange,
      intensity: passedRecord.intensity !== undefined ? Number(passedRecord.intensity) : defaultDetailData.intensity,
      triggers: passedRecord.triggerType ? [passedRecord.triggerType] : defaultDetailData.triggers,
      type: passedRecord.analysis?.nauseaType ?? defaultDetailData.type,
      originalText: passedRecord.originalText ?? defaultDetailData.originalText,
      analysis: passedRecord.analysis ?? defaultDetailData.analysis,
    };
  });

  // 3일 이내인지 확인
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

  // 인풋 값 변경
  const handleInputChange = (field, value) => {
    setDetailData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnalysisChange = (field, value) => {
    setDetailData((prev) => ({
      ...prev,
      analysis: { ...prev.analysis, [field]: value },
    }));
  };

  const handleTriggerChange = (e) => {
    const tagArray = e.target.value.split(',').map((t) => t.trim());
    setDetailData((prev) => ({ ...prev, triggers: tagArray }));
  };

  // 모달 열기 핸들러 (수정 모드일 때만 동작)
  const handleOpenModal = () => {
    if (!isEditing) return;
    setTempTimeSlot(detailData.timeSlotKey || '오전');
    setTempIntensity(detailData.intensity ?? 4);
    setIsModalOpen(true);
  };

  // 모달 선택 완료 핸들러
  const handleConfirmModal = () => {
    const selectedSlot = TIME_SLOTS.find((s) => s.label === tempTimeSlot);

    setDetailData((prev) => ({
      ...prev,
      timeSlotKey: tempTimeSlot,
      timeRange: selectedSlot ? selectedSlot.fullText : prev.timeRange,
      intensity: tempIntensity,
    }));
    setIsModalOpen(false);
  };

  // 수정하기 / 수정 완료 토글
  const handleToggleEdit = () => {
    if (isEditing) {
      // TODO: 백엔드 PATCH /records/{id} API 연동
      alert('수정이 완료되었습니다.');
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  // 삭제 핸들러
  const handleDelete = () => {
    if (window.confirm('기록을 삭제하시겠습니까?')) {
      alert('삭제되었습니다.');
      navigate(-1);
    }
  };

  return (
    <div className="tracker_detail_wrap">
      {/* 상단 헤더 */}
      <header className="tracker_detail_header">
        <img
          src={arrowLeftIcon}
          alt="뒤로가기"
          className="tracker_detail_back_btn"
          onClick={() => navigate(-1)}
        />
        <h2 className="tracker_detail_title">입덧기록 상세</h2>
      </header>

      <main className="tracker_detail_body">
        {/* 1. 기본 정보 카드 */}
        <section className="tracker_detail_card info_card">
          <div className="tracker_row">
            <span className="tracker_label">일자</span>
            <span className="tracker_value bold">{detailData.date}</span>
          </div>

          {/* 시간대 (수정 모드일 때 클릭 가능) */}
          <div
            className={`tracker_row ${isEditing ? 'clickable_row' : ''}`}
            onClick={handleOpenModal}
          >
            <span className="tracker_label">시간대</span>
            <span className={`tracker_value ${isEditing ? 'edit_highlight' : ''}`}>
              {detailData.timeRange} 
            </span>
          </div>

          {/* 입덧강도 (수정 모드일 때 클릭 가능) */}
          <div
            className={`tracker_row ${isEditing ? 'clickable_row' : ''}`}
            onClick={handleOpenModal}
          >
            <span className="tracker_label">입덧강도</span>
            <span className={`tracker_value ${isEditing ? 'edit_highlight' : ''}`}>
              {INTENSITY_LABELS[detailData.intensity] ?? `${detailData.intensity} | 심함`}{' '}
            </span>
          </div>

          {/* 유발원인 */}
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

          {/* 입덧유형 */}
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

        {/* 하단 버튼 영역 */}
        <div className="tracker_detail_btn_group">
          {canEdit && (
            <button
              type="button"
              className={`tracker_btn_edit ${isEditing ? 'active_save' : ''}`}
              onClick={handleToggleEdit}
            >
              {isEditing ? '수정 완료' : '수정하기'}
            </button>
          )}

          <button
            type="button"
            className="tracker_btn_delete"
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      </main>

      {/* 4. 시간대 / 입덧강도 선택 팝업 모달 */}
      {isModalOpen && (
        <div className="tracker_modal_backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="tracker_select_modal_card" onClick={(e) => e.stopPropagation()}>
            {/* 시간대 선택 */}
            <h4 className="tracker_modal_section_title">시간대</h4>
            <div className="tracker_modal_time_chips">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.label}
                  type="button"
                  className={`tracker_modal_chip ${tempTimeSlot === slot.label ? 'active' : ''}`}
                  onClick={() => setTempTimeSlot(slot.label)}
                >
                  {slot.label}
                </button>
              ))}
            </div>

            {/* 입덧강도 선택 (EmojiScale 컴포넌트 사용) */}
            <h4 className="tracker_modal_section_title">입덧강도</h4>
            <div className="tracker_modal_emoji_scale_wrapper">
              <EmojiScale
                levels={[0, 1, 2, 3, 4, 5]}
                value={tempIntensity}
                onChange={(newLevel) => setTempIntensity(newLevel)}
              />
            </div>

            {/* 선택완료 버튼 */}
            <button
              type="button"
              className="tracker_modal_confirm_btn"
              onClick={handleConfirmModal}
            >
              선택완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackerDetail;