import { useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import Chip from '../../components/Chip/Chip.jsx'
import Textarea from '../../components/Textarea/Textarea.jsx'
import VoiceRecorder from '../../components/VoiceRecorder/VoiceRecorder.jsx'
import EmojiScale from '../../components/EmojiScale/EmojiScale.jsx'
import aiSparkle from '../../assets/Home/img/ai-sparkle.svg'
import { homeMockData } from './mock/homeData.js'
import '../../assets/Home/scss/Home.scss'

function Home() {
  const { user, timeSlots, intensityLevels, todayRecords } = homeMockData

  const [symptomText, setSymptomText] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [intensity, setIntensity] = useState(null)

  const handleAutoSummary = () => {
    // TODO: API 연동 후 AI 자동 정리 요청
  }

  const handleRecordingComplete = (audioBlob) => {
    // TODO: 백엔드 음성 인식 API 연동 후 audioBlob 전송
    console.log('recorded audio blob', audioBlob)
  }

  return (
    <div className="home-wrap">
      <div className="home-hero">
        <div className="home-greeting">
          <p className="home-greeting-name">{user.name},</p>
          <p className="home-greeting-question">오늘의 컨디션은 어떤가요?</p>
        </div>

        <Textarea
          className="home-input"
          value={symptomText}
          onChange={(e) => setSymptomText(e.target.value)}
          placeholderMain="지금 느끼는 증상이나 상황을 자유롭게 입력하세요."
          placeholderHint="(자세하게 입력 할수록 더 정확한 분석이 가능해요)"
        >
          <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
        </Textarea>

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
      </div>

      <div className="home-divider" />

      <div className="home-records">
        <p className="home-records-title">오늘의 입덧 기록</p>
        <div className="home-records-card">
          {todayRecords.length === 0 ? (
            <p className="home-records-empty">아직 오늘의 기록이 없어요</p>
          ) : (
            todayRecords.map((record) => (
              <p key={record.id} className="home-records-item">{record.summary}</p>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
