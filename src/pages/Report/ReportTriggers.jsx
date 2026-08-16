import { useLocation } from 'react-router-dom'
import FactorDetailPage from '../../components/FactorDetailPage/FactorDetailPage.jsx'
import { reportMockData } from './mock/reportData.js'

function ReportTriggers() {
  const location = useLocation()
  const periodId = location.state?.periodId ?? reportMockData.selectedPeriodId
  const periodData = reportMockData.periods[periodId] ?? reportMockData.periods[reportMockData.selectedPeriodId]
  const { triggerFactors, otherTriggerFactors } = periodData

  return (
    <FactorDetailPage
      title="입덧 유발요인"
      descriptionLines={['AI가 입덧 기록을 분석하여', '다온님의 주요 입덧 유발 요인들을 추출했어요']}
      variant="trigger"
      topFactors={triggerFactors}
      otherFactorsTitle="그 외 유발요인"
      otherFactors={otherTriggerFactors}
    />
  )
}

export default ReportTriggers
