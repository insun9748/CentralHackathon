import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PeriodSelector from '../../components/PeriodSelector/PeriodSelector.jsx'
import LineChart from '../../components/LineChart/LineChart.jsx'
import FactorList from '../../components/FactorList/FactorList.jsx'
import TipItem from '../../components/TipItem/TipItem.jsx'
import SafetyNotice from '../../components/SafetyNotice/SafetyNotice.jsx'
import shareIcon from '../../assets/Report/img/share-icon.svg'
import aiInsightIcon from '../../assets/Report/img/ai-insight-icon.svg'
import { reportMockData } from './mock/reportData.js'
import '../../assets/Report/scss/Report.scss'

function Report() {
  const { periodOptions } = reportMockData
  const [selectedPeriodId, setSelectedPeriodId] = useState(reportMockData.selectedPeriodId)
  const navigate = useNavigate()

  // TODO: API 연동 후 selectedPeriodId(또는 사용자 지정 날짜범위) 기준으로 서버에서 조회하도록 교체
  const periodData = reportMockData.periods[selectedPeriodId] ?? reportMockData.periods[reportMockData.selectedPeriodId]
  const { chart, aiInsight, triggerFactors, reliefFactors, tips } = periodData

  const handleShare = () => {
    // TODO: 리포트 공유 기능 연동
  }

  return (
    <div className="report-wrap">
      <div className="report-header">
        <p className="report-title">리포트</p>
        <button type="button" className="report-share-btn" onClick={handleShare} aria-label="리포트 공유">
          <img src={shareIcon} alt="" />
        </button>
      </div>

      <PeriodSelector
        className="report-period"
        options={periodOptions}
        value={selectedPeriodId}
        onChange={setSelectedPeriodId}
      />

      <div className="report-chart-card">
        <LineChart points={chart.points} max={chart.max} />

        <div className="report-ai-insight">
          <div className="report-ai-insight-badge">
            <img src={aiInsightIcon} alt="" />
            <span>AI 한 줄 인사이트</span>
          </div>
          <div className="report-ai-insight-text">
            {aiInsight.lines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="report-factor-card-btn"
        onClick={() => navigate('/report/triggers', { state: { periodId: selectedPeriodId } })}
      >
        <FactorList
          className="report-card"
          variant="trigger"
          title={triggerFactors.title}
          subtitle={triggerFactors.subtitle}
          items={triggerFactors.items}
        />
      </button>

      <button
        type="button"
        className="report-factor-card-btn"
        onClick={() => navigate('/report/relief', { state: { periodId: selectedPeriodId } })}
      >
        <FactorList
          className="report-card"
          variant="relief"
          title={reliefFactors.title}
          subtitle={reliefFactors.subtitle}
          items={reliefFactors.items}
        />
      </button>

      <div className="report-tip-card">
        <p className="report-tip-title">다온님을 위한 입덧 관리 TIP!</p>
        <ul className="report-tip-list">
          {tips.map((tip, i) => (
            <TipItem key={i} emoji={tip.emoji} title={tip.title} lines={tip.lines} />
          ))}
        </ul>
      </div>

      <SafetyNotice />
    </div>
  )
}

export default Report
