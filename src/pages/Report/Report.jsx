import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PeriodSelector from '../../components/PeriodSelector/PeriodSelector.jsx'
import LineChart from '../../components/LineChart/LineChart.jsx'
import FactorList from '../../components/FactorList/FactorList.jsx'
import TipItem from '../../components/TipItem/TipItem.jsx'
import SafetyNotice from '../../components/SafetyNotice/SafetyNotice.jsx'
import shareIcon from '../../assets/Report/img/share-icon.svg'
import aiInsightIcon from '../../assets/Report/img/ai-insight-icon.svg'
import { getReport } from '../../api/report.js'
import { getErrorMessage } from '../../api/client.js'
import { resolvePeriodRange } from '../../utils/reportPeriod.js'
import '../../assets/Report/scss/Report.scss'

const PERIOD_OPTIONS = [
  { id: 'week1', label: '최근 1주' },
  { id: 'week2', label: '최근 2주' },
  { id: 'month1', label: '최근 1달' },
  { id: 'custom', label: '사용자 지정' },
]

function toFactorItems(factors = []) {
  return factors.map((factor, index) => ({
    rank: String(index + 1).padStart(2, '0'),
    name: factor.factor,
    detail: `${factor.count}회`,
  }))
}

function Report() {
  const [selectedPeriodId, setSelectedPeriodId] = useState('week1')
  const [customRange, setCustomRange] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const range = useMemo(() => resolvePeriodRange(selectedPeriodId, customRange), [selectedPeriodId, customRange])

  useEffect(() => {
    if (!range) return
    let cancelled = false

    const fetchReport = async () => {
      // effect 실행과 동기적으로 얽히지 않도록 한 틱 양보한 뒤 상태를 갱신한다
      await Promise.resolve()
      if (cancelled) return
      setLoading(true)
      setError(null)
      try {
        const data = await getReport(range.startDate, range.endDate)
        if (!cancelled) setReport(data)
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, '리포트를 불러오지 못했습니다.'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchReport()
    return () => {
      cancelled = true
    }
  }, [range])

  const handleShare = () => {
    // TODO: 리포트 공유 기능 연동 (백엔드 미제공)
  }

  const chartPoints = (report?.timeCategoryAnalysis ?? []).map((t) => ({
    label: t.timeCategory,
    range: `${t.recordCount}회`,
    value: t.averageIntensity,
    avgIntensity: t.averageIntensity,
    mainCause: t.mainTriggerFactor,
  }))
  const chartMax = Math.max(5, ...chartPoints.map((p) => p.value ?? 0))

  const triggerItems = toFactorItems(report?.triggerFactors)
  const reliefItems = toFactorItems(report?.reliefFactors)

  return (
    <div className="report-wrap">
      <div className="report-nav"></div>
      <div className="report-header">
        <p className="report-title">리포트</p>
        <button type="button" className="report-share-btn" onClick={handleShare} aria-label="리포트 공유">
          <img src={shareIcon} alt="" />
        </button>
      </div>

      <PeriodSelector
        className="report-period"
        options={PERIOD_OPTIONS}
        value={selectedPeriodId}
        onChange={setSelectedPeriodId}
        onCustomRangeChange={setCustomRange}
      />

      {loading && <p className="report-loading">불러오는 중...</p>}
      {error && <p className="report-loading">{error}</p>}

      {!loading && !error && report && (
        <>
          <div className="report-chart-card">
            {chartPoints.length > 0 ? (
              <LineChart points={chartPoints} max={chartMax} />
            ) : (
              <p className="report-empty">이 기간에는 완료된 기록이 없어요</p>
            )}

            <div className="report-ai-insight">
              <div className="report-ai-insight-badge">
                <img src={aiInsightIcon} alt="" />
                <span>AI 한 줄 인사이트</span>
              </div>
              <div className="report-ai-insight-text">
                <p>{report.aiTrend || '아직 분석할 완료된 기록이 충분하지 않아요'}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="report-factor-card-btn"
            onClick={() => navigate('/report/triggers', { state: { startDate: range.startDate, endDate: range.endDate } })}
          >
            <FactorList
              className="report-card"
              variant="trigger"
              title="주요 유발 요인 TOP3"
              subtitle="주의가 필요해요"
              items={triggerItems.slice(0, 3)}
            />
          </button>

          <button
            type="button"
            className="report-factor-card-btn"
            onClick={() => navigate('/report/relief', { state: { startDate: range.startDate, endDate: range.endDate } })}
          >
            <FactorList
              className="report-card"
              variant="relief"
              title="완화 요인 TOP3"
              subtitle="나에게 잘 맞아요"
              items={reliefItems.slice(0, 3)}
            />
          </button>

          {report.aiManagementGuide && (
            <div className="report-tip-card">
              <p className="report-tip-title">다온님을 위한 입덧 관리 TIP!</p>
              <ul className="report-tip-list">
                <TipItem emoji="💡" title="AI 관리 가이드" lines={[report.aiManagementGuide]} />
              </ul>
            </div>
          )}

          <SafetyNotice />
        </>
      )}
    </div>
  )
}

export default Report
