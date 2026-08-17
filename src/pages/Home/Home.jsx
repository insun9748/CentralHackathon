import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Chip from '../../components/Chip/Chip.jsx'
import Textarea from '../../components/Textarea/Textarea.jsx'
import VoiceRecorder from '../../components/VoiceRecorder/VoiceRecorder.jsx'
import EmojiScale from '../../components/EmojiScale/EmojiScale.jsx'
import AiAnalysisCard from '../../components/AiAnalysisCard/AiAnalysisCard.jsx'
import TrackerRecordCard from '../../components/TrackerRecordCard/TrackerRecordCard.jsx'
import { todayDateKey, useRecords } from '../../context/records-context.js'
import { useCategories } from '../../hooks/useCategories.js'
import { convertVoice } from '../../api/voice.js'
import { getMe } from '../../api/user.js'
import { getErrorMessage } from '../../api/client.js'
import { toLocalDateTimeString } from '../../utils/date.js'
import aiSparkle from '../../assets/Home/img/ai-sparkle.svg'
import aiLoading from '../../assets/Home/img/ai-loading.svg'
import aiPlus from '../../assets/Home/img/ai-plus.svg'
import '../../assets/Home/scss/Home.scss'

const REVEAL_INTERVAL_MS = 500

const NAUSEA_TYPES = ['침덧', '토덧', '먹덧']

const ANALYSIS_FIELD_DEFS = [
  { id: 'triggerFactor', label: '입덧 유발 요인' },
  { id: 'symptomSummary', label: '증상 요약' },
  { id: 'nauseaType', label: '입덧 유형', options: NAUSEA_TYPES },
  { id: 'reliefFactor', label: '완화 요인' },
  { id: 'situationAnalysis', label: '발생 상황' },
  { id: 'foodAnalysis', label: '음식 분석' },
  { id: 'emotionAnalysis', label: '감정 분석' },
]

function Home() {
  const { timeCategories, intensities } = useCategories()
  const { todayRecords, addRecord, analyzeAndAttach, editRecord } = useRecords()

  const [symptomText, setSymptomText] = useState('')
  const [selectedTimeCategoryId, setSelectedTimeCategoryId] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)

  // 'form' | 'submitting' | 'analyzing'
  // submitting: 기록 생성 + AI 분석 API 응답을 기다리는 중 (아직 필드 값이 없음)
  // analyzing: 응답을 받은 필드 값을 한 줄씩 순차적으로 공개하는 애니메이션 진행 중 (다 공개되면 isDone)
  const [viewState, setViewState] = useState('form')
  const [recordText, setRecordText] = useState('')
  const [revealedCount, setRevealedCount] = useState(0)
  const [fieldValues, setFieldValues] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [currentRecordId, setCurrentRecordId] = useState(null)
  const [currentRecordDateTime, setCurrentRecordDateTime] = useState(null)
  const [aiSummary, setAiSummary] = useState('')
  const [saving, setSaving] = useState(false)
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    getMe()
      .then((data) => setNickname(data.nickname ?? ''))
      .catch(() => {})
  }, [])

  const intensityLevels = intensities.map((intensity) => intensity.level).sort((a, b) => a - b)

  useEffect(() => {
    if (viewState !== 'analyzing') return undefined
    if (revealedCount >= ANALYSIS_FIELD_DEFS.length) return undefined

    const timer = setInterval(() => {
      setRevealedCount((count) => {
        if (count >= ANALYSIS_FIELD_DEFS.length) {
          clearInterval(timer)
          return count
        }
        return count + 1
      })
    }, REVEAL_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [viewState, revealedCount])

  const isDone = viewState === 'analyzing' && revealedCount >= ANALYSIS_FIELD_DEFS.length

  const findIntensityId = (level) => intensities.find((intensity) => intensity.level === level)?.intensityId ?? null

  const resetForm = () => {
    setSymptomText('')
    setSelectedTimeCategoryId(null)
    setSelectedLevel(null)
    setRecordText('')
    setRevealedCount(0)
    setIsEditing(false)
    setCurrentRecordId(null)
    setCurrentRecordDateTime(null)
    setAiSummary('')
    setViewState('form')
  }

  const handleAutoSummary = async () => {
    if (!symptomText.trim()) return
    if (!selectedTimeCategoryId) {
      alert('시간대를 선택해 주세요.')
      return
    }
    if (selectedLevel == null) {
      alert('입덧강도를 선택해 주세요.')
      return
    }

    const intensityId = findIntensityId(selectedLevel)
    const recordDateTime = toLocalDateTimeString(new Date())

    setRecordText(symptomText)
    setRevealedCount(0)
    setIsEditing(false)
    setViewState('submitting')

    try {
      const recordId = await addRecord({
        timeCategoryId: selectedTimeCategoryId,
        intensityId,
        recordDateTime,
        memo: symptomText,
      })
      setCurrentRecordId(recordId)
      setCurrentRecordDateTime(recordDateTime)

      const analysis = await analyzeAndAttach(recordId)
      setAiSummary(analysis.aiSummary ?? '')
      setFieldValues({
        triggerFactor: analysis.triggerFactor ?? '',
        symptomSummary: analysis.symptomSummary ?? '',
        nauseaType: analysis.nauseaType ?? NAUSEA_TYPES[0],
        reliefFactor: analysis.reliefFactor ?? '',
        situationAnalysis: analysis.situationAnalysis ?? '',
        foodAnalysis: analysis.foodAnalysis ?? '',
        emotionAnalysis: analysis.emotionAnalysis ?? '',
      })
      // 필드 값이 준비된 뒤에야 한 줄씩 공개하는 애니메이션을 시작한다
      setViewState('analyzing')
    } catch (err) {
      alert(getErrorMessage(err, 'AI 분석에 실패했습니다.'))
      resetForm()
    }
  }

  const handleToggleEdit = () => {
    setIsEditing((editing) => !editing)
  }

  const handleFieldValueChange = (fieldId, value) => {
    setFieldValues((values) => ({ ...values, [fieldId]: value }))
  }

  const handleSaveRecord = async () => {
    if (!currentRecordId) return
    setSaving(true)
    try {
      await editRecord(currentRecordId, {
        timeCategoryId: selectedTimeCategoryId,
        intensityId: findIntensityId(selectedLevel),
        recordDateTime: currentRecordDateTime,
        memo: recordText,
        aiSummary,
        ...fieldValues,
      })
      resetForm()
    } catch (err) {
      alert(getErrorMessage(err, '기록 저장에 실패했습니다.'))
    } finally {
      setSaving(false)
    }
  }

  const handleRecordingComplete = async (audioBlob) => {
    try {
      const result = await convertVoice(audioBlob)
      setSymptomText(result.memo || result.originalText || '')
      if (result.timeCategoryId) setSelectedTimeCategoryId(result.timeCategoryId)
      if (result.intensityId) {
        const matched = intensities.find((intensity) => intensity.intensityId === result.intensityId)
        if (matched) setSelectedLevel(matched.level)
      }
    } catch (err) {
      alert(getErrorMessage(err, '음성 인식에 실패했습니다.'))
    }
  }

  const isReviewing = viewState !== 'form'
  const recordsToday = todayRecords.filter((record) => record.date === todayDateKey())
  const analysisFields = ANALYSIS_FIELD_DEFS.map((field) => ({ ...field, value: fieldValues[field.id] ?? '' }))

  return (
    <div className="home-wrap">
      <div className="home-nav"></div>
      <div className="home-hero">
        <div className="home-greeting">
          {nickname && <p className="home-greeting-name">{nickname}님,</p>}
          <p className="home-greeting-question">오늘의 컨디션은 어떤가요?</p>
        </div>

        {isReviewing ? (
          <p className="home-record-text">{recordText}</p>
        ) : (
          <Textarea
            className="home-input"
            value={symptomText}
            onChange={(e) => setSymptomText(e.target.value)}
            placeholderMain="지금 느끼는 증상이나 상황을 자유롭게 입력하세요."
            placeholderHint="(자세하게 입력 할수록 더 정확한 분석이 가능해요)"
          >
            <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
          </Textarea>
        )}

        {!isReviewing && (
          <>
            <div className="home-section">
              <p className="home-section-label">시간대</p>
              <div className="home-timeslot-list">
                {timeCategories.map((slot) => (
                  <Chip
                    key={slot.timeCategoryId}
                    label={slot.name}
                    active={selectedTimeCategoryId === slot.timeCategoryId}
                    onClick={() => setSelectedTimeCategoryId(slot.timeCategoryId)}
                  />
                ))}
              </div>
            </div>

            <div className="home-section">
              <p className="home-section-label">입덧강도</p>
              <EmojiScale levels={intensityLevels} value={selectedLevel} onChange={setSelectedLevel} />
            </div>

            <Button className="home-ai-btn" icon={aiSparkle} onClick={handleAutoSummary}>
              AI 자동 정리
            </Button>
          </>
        )}

        {viewState === 'submitting' && (
          <div className="home-analysis-actions">
            <Button variant="disabled" icon={aiLoading} className="home-ai-progress-btn">
              AI 정리 진행중
            </Button>
          </div>
        )}

        {viewState === 'analyzing' && (
          <>
            <AiAnalysisCard
              className="home-analysis-card"
              fields={analysisFields}
              revealedCount={revealedCount}
              done={isDone}
              editable={isDone && isEditing}
              onChange={handleFieldValueChange}
            />

            <div className="home-analysis-actions">
              {!isDone ? (
                <Button variant="disabled" icon={aiLoading} className="home-ai-progress-btn">
                  AI 정리 진행중
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleToggleEdit}>
                    {isEditing ? '수정 완료' : '수정하기'}
                  </Button>
                  <Button variant="primary" icon={aiPlus} onClick={handleSaveRecord}>
                    {saving ? '저장 중...' : '기록 저장'}
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className="home-divider" />

      <div className="home-records">
        <p className="home-records-title">오늘의 입덧 기록</p>
        {recordsToday.length === 0 ? (
          <div className="home-records-card">
            <p className="home-records-empty">아직 오늘의 기록이 없어요</p>
          </div>
        ) : (
          <div className="record_card_list">
            {recordsToday.map((record) => (
              <TrackerRecordCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
