import { useState } from 'react'
import Dropdown from '../../components/Dropdown/Dropdown.jsx'
import LineChart from '../../components/LineChart/LineChart.jsx'
import FactorList from '../../components/FactorList/FactorList.jsx'
import TipItem from '../../components/TipItem/TipItem.jsx'
import shareIcon from '../../assets/Report/img/share-icon.svg'
import warningIcon from '../../assets/Report/img/warning-icon.svg'
import aiInsightIcon from '../../assets/Report/img/ai-insight-icon.svg'
import { reportMockData } from './mock/reportData.js'
import '../../assets/Report/scss/Report.scss'

function Report() {
  const { periodOptions, chart, aiInsight, triggerFactors, reliefFactors, tips } = reportMockData
  const [selectedPeriodId, setSelectedPeriodId] = useState(reportMockData.selectedPeriodId)

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

      <Dropdown
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

      <FactorList
        className="report-card"
        variant="trigger"
        title={triggerFactors.title}
        subtitle={triggerFactors.subtitle}
        items={triggerFactors.items}
      />

      <FactorList
        className="report-card"
        variant="relief"
        title={reliefFactors.title}
        subtitle={reliefFactors.subtitle}
        items={reliefFactors.items}
      />

      <div className="report-tip-card">
        <p className="report-tip-title">다온님을 위한 입덧 관리 TIP!</p>
        <ul className="report-tip-list">
          {tips.map((tip, i) => (
            <TipItem key={i} emoji={tip.emoji} title={tip.title} lines={tip.lines} />
          ))}
        </ul>
      </div>

      <div className="report-safety-notice">
        <div className="report-safety-notice-header">
          <img src={warningIcon} alt="" />
          <span>의료 안전 안내</span>
        </div>
        <p className="report-safety-notice-text">
          반복적인 구토, 수분 섭취 불가, 극심한 어지러움이 지속되는 경우에는 즉시 의료기관에 상담하세요. 이
          리포트는 진단·처방을 대체하지 않습니다.
        </p>
      </div>
    </div>
  )
}

export default Report
