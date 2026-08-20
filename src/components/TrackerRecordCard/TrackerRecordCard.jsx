import { useNavigate } from 'react-router-dom'
import goodIcon from '../../assets/tracker/img/tracker_good.svg'
import sosoIcon from '../../assets/tracker/img/tracker_soso.svg'
import badIcon from '../../assets/tracker/img/tracker_bad.svg'
import cardArrow from '../../assets/tracker/img/tracker_card_arrow.svg'
import './TrackerRecordCard.scss'

const emotionIcons = { good: goodIcon, soso: sosoIcon, bad: badIcon }
const emotionLabels = { good: '좋음', soso: '보통', bad: '나쁨' }

function TrackerRecordCard({ record, basePath = '/tracker/detail' }) {
  const navigate = useNavigate()
  const { id, timeCategory, emotion, title, triggerType, symptom, intensity } = record

  return (
    <div className="tracker_record_card">
      <div className="tracker_card_header">
        <div className="trakcer_badge_group">
          <span className="tracker_time_badge">{timeCategory}</span>
          <div className="emotion_badge">
            <img src={emotionIcons[emotion]} alt={emotionLabels[emotion]} className="tracker_emotion_img" />
          </div>
        </div>
        <img
          src={cardArrow}
          className="tracker_card_arrow"
          alt=""
          onClick={() => navigate(`${basePath}/${id}`)}
        />
      </div>

      <p className="tracker_card_title">{title}</p>

      <p className="tracker_card_info">
        유발유형: {triggerType}/ 증상: {symptom}/ 강도: {intensity}
      </p>
    </div>
  )
}

export default TrackerRecordCard
