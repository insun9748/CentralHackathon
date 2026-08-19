import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmojiScale from '../../components/EmojiScale/EmojiScale.jsx';
import { useCategories } from '../../hooks/useCategories.js';
import { useRecords } from '../../context/records-context.js';
import { getRecord } from '../../api/record.js';
import { analyzeRecord } from '../../api/ai.js';
import { getErrorMessage } from '../../api/client.js';
import '../../assets/tracker/scss/tracker_detail.scss';

import arrowLeftIcon from '../../assets/tracker/img/tracker_left.svg';

function formatDate(recordDateTime) {
  if (!recordDateTime) return '';
  return recordDateTime.slice(0, 10).replace(/-/g, '.');
}

function TrackerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { timeCategories, intensities } = useCategories();
  const { editRecord, removeRecord } = useRecords();

  const [record, setRecord] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempTimeCategoryId, setTempTimeCategoryId] = useState(null);
  const [tempLevel, setTempLevel] = useState(null);

  const [form, setForm] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchRecord = async () => {
      // effect 실행과 동기적으로 얽히지 않도록 한 틱 양보한 뒤 상태를 갱신한다
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      try {
        const data = await getRecord(id);
        if (cancelled) return;
        setRecord(data);
        setForm({
          timeCategoryId: data.timeCategory?.timeCategoryId ?? null,
          intensityLevel: data.intensity?.level ?? null,
          memo: data.memo ?? '',
          triggerFactor: '',
          reliefFactor: '',
          nauseaType: '',
          symptomSummary: '',
          situationAnalysis: '',
          foodAnalysis: '',
          emotionAnalysis: '',
        });
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, '기록을 불러오지 못했습니다.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRecord();

    // AI 분석 결과 조회 (이미 분석된 기록이면 캐시된 결과를 그대로 받는다)
    analyzeRecord(id)
      .then((data) => {
        if (cancelled) return;
        setAnalysis(data);
        setForm((prev) => prev && {
          ...prev,
          triggerFactor: data.triggerFactor ?? '',
          reliefFactor: data.reliefFactor ?? '',
          nauseaType: data.nauseaType ?? '',
          symptomSummary: data.symptomSummary ?? '',
          situationAnalysis: data.situationAnalysis ?? '',
          foodAnalysis: data.foodAnalysis ?? '',
          emotionAnalysis: data.emotionAnalysis ?? '',
        });
      })
      .catch((err) => console.error(getErrorMessage(err)));

    return () => {
      cancelled = true;
    };
  }, [id]);

  const canEdit = record?.status === 'DRAFT';
  const triggerTags = (form?.triggerFactor || '').split(',').map((t) => t.trim()).filter(Boolean);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTriggerChange = (e) => {
    handleFormChange('triggerFactor', e.target.value);
  };

  const handleOpenModal = () => {
    if (!isEditing) return;
    setTempTimeCategoryId(form.timeCategoryId);
    setTempLevel(form.intensityLevel);
    setIsModalOpen(true);
  };

  const handleConfirmModal = () => {
    setForm((prev) => ({ ...prev, timeCategoryId: tempTimeCategoryId, intensityLevel: tempLevel }));
    setIsModalOpen(false);
  };

  const handleToggleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const intensityId = intensities.find((i) => i.level === form.intensityLevel)?.intensityId;
    setSaving(true);
    try {
      await editRecord(id, {
        timeCategoryId: form.timeCategoryId,
        intensityId,
        recordDateTime: record.recordDateTime,
        memo: form.memo,
        aiSummary: analysis?.aiSummary ?? '',
        triggerFactor: form.triggerFactor,
        reliefFactor: form.reliefFactor,
        nauseaType: form.nauseaType,
        symptomSummary: form.symptomSummary,
        situationAnalysis: form.situationAnalysis,
        foodAnalysis: form.foodAnalysis,
        emotionAnalysis: form.emotionAnalysis,
      });
      const refreshed = await getRecord(id);
      setRecord(refreshed);
      setIsEditing(false);
    } catch (err) {
      alert(getErrorMessage(err, '기록 수정에 실패했습니다.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('기록을 삭제하시겠습니까?')) return;
    try {
      await removeRecord(id);
      navigate(-1);
    } catch (err) {
      alert(getErrorMessage(err, '기록 삭제에 실패했습니다.'));
    }
  };

  if (loading || !record || !form) {
    return (
      <div className="tracker_detail_wrap">
        <header className="tracker_detail_header">
          <img src={arrowLeftIcon} alt="뒤로가기" className="tracker_detail_back_btn" onClick={() => navigate(-1)} />
          <h2 className="tracker_detail_title">입덧기록 상세</h2>
        </header>
        {error ? <p className="record_empty_text">{error}</p> : <p className="record_empty_text">불러오는 중...</p>}
      </div>
    );
  }

  const timeCategoryName = timeCategories.find((t) => t.timeCategoryId === form.timeCategoryId)?.name ?? record.timeCategory?.name;
  const intensityDescription = intensities.find((i) => i.level === form.intensityLevel)?.description ?? record.intensity?.description;

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
            <span className="tracker_value bold">{formatDate(record.recordDateTime)}</span>
          </div>

          <div
            className={`tracker_row ${isEditing ? 'clickable_row' : ''}`}
            onClick={handleOpenModal}
          >
            <span className="tracker_label">시간대</span>
            <span className={`tracker_value ${isEditing ? 'edit_highlight' : ''}`}>
              {timeCategoryName}
            </span>
          </div>

          <div
            className={`tracker_row ${isEditing ? 'clickable_row' : ''}`}
            onClick={handleOpenModal}
          >
            <span className="tracker_label">입덧강도</span>
            <span className={`tracker_value ${isEditing ? 'edit_highlight' : ''}`}>
              {form.intensityLevel} | {intensityDescription}
            </span>
          </div>

          {/* 유발원인 */}
          <div className="tracker_row">
            <span className="tracker_label">유발원인</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={form.triggerFactor}
                onChange={handleTriggerChange}
                placeholder="쉼표(,)로 구분"
              />
            ) : (
              <div className="tracker_tag_group">
                {triggerTags.length > 0 ? (
                  triggerTags.map((tag, idx) => (
                    <span key={idx} className="tracker_cause_tag">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="tracker_value">-</span>
                )}
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
                value={form.nauseaType}
                onChange={(e) => handleFormChange('nauseaType', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{form.nauseaType}</span>
            )}
          </div>
        </section>

        {/* 2. 기록 원문 카드 */}
        <section className="tracker_detail_card original_card">
          <h4 className="tracker_card_subtitle">기록 원문</h4>
          {isEditing ? (
            <textarea
              className="tracker_edit_textarea"
              value={form.memo}
              onChange={(e) => handleFormChange('memo', e.target.value)}
              rows={4}
            />
          ) : (
            <p className="tracker_original_content">{form.memo}</p>
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
                value={form.triggerFactor}
                onChange={handleTriggerChange}
              />
            ) : (
              <span className="tracker_value">{form.triggerFactor || '-'}</span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_mint_label">증상 요약</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={form.symptomSummary}
                onChange={(e) => handleFormChange('symptomSummary', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{form.symptomSummary || '-'}</span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_mint_label">입덧 유형</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={form.nauseaType}
                onChange={(e) => handleFormChange('nauseaType', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{form.nauseaType}</span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_mint_label">완화 요인</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={form.reliefFactor}
                onChange={(e) => handleFormChange('reliefFactor', e.target.value)}
              />
            ) : (
              <span className={`tracker_value ${!form.reliefFactor ? 'relief_gray' : ''}`}>
                {form.reliefFactor || '발견되지 않음'}
              </span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_mint_label">발생 상황</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={form.situationAnalysis}
                onChange={(e) => handleFormChange('situationAnalysis', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{form.situationAnalysis || '-'}</span>
            )}
          </div>

          <div className="tracker_row">
            <span className="tracker_mint_label">감정 및 컨디션</span>
            {isEditing ? (
              <input
                type="text"
                className="tracker_edit_input"
                value={form.emotionAnalysis}
                onChange={(e) => handleFormChange('emotionAnalysis', e.target.value)}
              />
            ) : (
              <span className="tracker_value">{form.emotionAnalysis || '-'}</span>
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
              disabled={saving}
            >
              {isEditing ? (saving ? '저장 중...' : '수정 완료') : '수정하기'}
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
            <h4 className="tracker_modal_section_title">시간대</h4>
            <div className="tracker_modal_time_chips">
              {timeCategories.map((slot) => (
                <button
                  key={slot.timeCategoryId}
                  type="button"
                  className={`tracker_modal_chip ${tempTimeCategoryId === slot.timeCategoryId ? 'active' : ''}`}
                  onClick={() => setTempTimeCategoryId(slot.timeCategoryId)}
                >
                  {slot.name}
                </button>
              ))}
            </div>

            <h4 className="tracker_modal_section_title">입덧강도</h4>
            <div className="tracker_modal_emoji_scale_wrapper">
              <EmojiScale
                levels={intensities.map((i) => i.level).sort((a, b) => a - b)}
                value={tempLevel}
                onChange={setTempLevel}
              />
            </div>

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
