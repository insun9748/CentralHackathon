import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Chip from '../../components/Chip/Chip.jsx'
import Textarea from '../../components/Textarea/Textarea.jsx'
import VoiceRecorder from '../../components/VoiceRecorder/VoiceRecorder.jsx'
import EmojiScale from '../../components/EmojiScale/EmojiScale.jsx'
import AiAnalysisCard from '../../components/AiAnalysisCard/AiAnalysisCard.jsx'
import TrackerRecordCard from '../../components/TrackerRecordCard/TrackerRecordCard.jsx'
import { todayDateKey, useRecords } from '../../context/records-context.js'
import aiSparkle from '../../assets/Home/img/ai-sparkle.svg'
import aiLoading from '../../assets/Home/img/ai-loading.svg'
import aiPlus from '../../assets/Home/img/ai-plus.svg'
import { homeMockData } from './mock/homeData.js'
import '../../assets/Home/scss/Home.scss'

const REVEAL_INTERVAL_MS = 500

function emotionFromIntensity(level) {
  if (level == null) return 'soso'
  if (level <= 1) return 'good'
  if (level <= 3) return 'soso'
  return 'bad'
}

function Home() {
  const { user, timeSlots, intensityLevels, analysisFields, summaryTitle, triggerCategory } = homeMockData

  const [symptomText, setSymptomText] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [intensity, setIntensity] = useState(null)
  const { todayRecords, addRecord } = useRecords()

  // 'form' | 'analyzing' | 'result'
  const [viewState, setViewState] = useState('form')
  const [recordText, setRecordText] = useState('')
  const [revealedCount, setRevealedCount] = useState(0)
  const [fieldValues, setFieldValues] = useState(() =>
    Object.fromEntries(analysisFields.map((field) => [field.id, field.value]))
  )
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (viewState !== 'analyzing') return undefined

    // TODO: API 연동 후 실제 AI 분석 진행 상태로 교체
    const timer = setInterval(() => {
      setRevealedCount((count) => {
        if (count >= analysisFields.length) {
          clearInterval(timer)
          setViewState('result')
          return count
        }
        return count + 1
      })
    }, REVEAL_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [viewState, analysisFields.length])

  const handleAutoSummary = () => {
    if (!symptomText.trim()) return
    setRecordText(symptomText)
    setFieldValues(Object.fromEntries(analysisFields.map((field) => [field.id, field.value])))
    setRevealedCount(2)
    setIsEditing(false)
    setViewState('analyzing')
  }

  const handleToggleEdit = () => {
    setIsEditing((editing) => !editing)
  }

  const handleFieldValueChange = (fieldId, value) => {
    setFieldValues((values) => ({ ...values, [fieldId]: value }))
  }

  const handleSaveRecord = () => {
    const timeCategory = timeSlots.find((slot) => slot.id === selectedTimeSlot)?.label ?? ''
    const newRecord = {
      id: Date.now(),
      date: todayDateKey(),
      timeCategory,
      emotion: emotionFromIntensity(intensity),
      title: summaryTitle,
      // 카드 요약 줄(유발유형/증상/강도)은 짧은 카테고리만 노출 — 상세 설명은 analysis.cause 쪽에 따로 저장
      triggerType: triggerCategory,
      symptom: fieldValues.symptom,
      intensity: intensity ?? 0,
      // 카드 표지에는 짧은 요약만 노출하고, 입력한 원문 그대로는 상세 페이지의 "기록 원문"에 전달
      originalText: recordText,
      analysis: {
        cause: fieldValues.trigger,
        symptomSummary: fieldValues.symptom,
        nauseaType: fieldValues.type,
        reliefFactor: fieldValues.relief,
        situation: fieldValues.situation,
        condition: fieldValues.condition,
      },
    }
    addRecord(newRecord)
    setSymptomText('')
    setSelectedTimeSlot(null)
    setIntensity(null)
    setRecordText('')
    setRevealedCount(0)
    setIsEditing(false)
    setViewState('form')
  }

  const handleRecordingComplete = (audioBlob) => {
    // TODO: 백엔드 음성 인식 API 연동 후 audioBlob 전송
    console.log('recorded audio blob', audioBlob)
  }

  const isReviewing = viewState !== 'form'
  const recordsToday = todayRecords.filter((record) => record.date === todayDateKey())

  return (
    <div className="home-wrap">
      <div className="home-nav"></div>
      <div className="home-hero">
        <div className="home-greeting">
          <p className="home-greeting-name">{user.name},</p>
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
                {timeSlots.map((slot) => (
                  <Chip
                    key={slot.id}
                    label={slot.label}
                    active={selectedTimeSlot === slot.id}
                    onClick={() => setSelectedTimeSlot(slot.id)}
                  />
                ))}
              </div>
            </div>

            <div className="home-section">
              <p className="home-section-label">입덧강도</p>
              <EmojiScale levels={intensityLevels} value={intensity} onChange={setIntensity} />
            </div>

            <Button className="home-ai-btn" icon={aiSparkle} onClick={handleAutoSummary}>
              AI 자동 정리
            </Button>
          </>
        )}

        {isReviewing && (
          <>
            <AiAnalysisCard
              className="home-analysis-card"
              fields={analysisFields.map((field) => ({ ...field, value: fieldValues[field.id] }))}
              revealedCount={revealedCount}
              done={viewState === 'result'}
              editable={viewState === 'result' && isEditing}
              onChange={handleFieldValueChange}
            />

            <div className="home-analysis-actions">
              {viewState === 'analyzing' ? (
                <Button variant="disabled" icon={aiLoading} className="home-ai-progress-btn">
                  AI 정리 진행중
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleToggleEdit}>
                    {isEditing ? '수정 완료' : '수정하기'}
                  </Button>
                  <Button variant="primary" icon={aiPlus} onClick={handleSaveRecord}>
                    기록 저장
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
