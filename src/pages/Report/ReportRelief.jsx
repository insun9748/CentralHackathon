import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import FactorDetailPage from '../../components/FactorDetailPage/FactorDetailPage.jsx'
import { getReport } from '../../api/report.js'
import { getErrorMessage } from '../../api/client.js'
import { resolvePeriodRange } from '../../utils/reportPeriod.js'

function toFactorItems(factors = []) {
  return factors.map((factor, index) => ({
    rank: String(index + 1).padStart(2, '0'),
    name: factor.factor,
    detail: `${factor.count}회`,
  }))
}

function ReportRelief() {
  const location = useLocation()
  const range = location.state?.startDate
    ? location.state
    : resolvePeriodRange('week1')

  const [report, setReport] = useState(null)

  useEffect(() => {
    getReport(range.startDate, range.endDate)
      .then(setReport)
      .catch((err) => console.error(getErrorMessage(err)))
  }, [range.startDate, range.endDate])

  const items = toFactorItems(report?.reliefFactors)

  return (
    <FactorDetailPage
      title="입덧 완화요인"
      descriptionLines={['AI가 입덧 기록을 분석하여', '다온님의 입덧 완화에 도움이 된 요인들을 추출했어요']}
      variant="relief"
      topFactors={{ title: '완화 요인 TOP3', subtitle: '나에게 잘 맞아요', items: items.slice(0, 3) }}
      otherFactorsTitle="그 외 완화요인"
      otherFactors={items.slice(3)}
    />
  )
}

export default ReportRelief
