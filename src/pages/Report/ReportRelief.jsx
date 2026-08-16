import { useLocation } from 'react-router-dom'
import FactorDetailPage from '../../components/FactorDetailPage/FactorDetailPage.jsx'
import { reportMockData } from './mock/reportData.js'

function ReportRelief() {
  const location = useLocation()
  const periodId = location.state?.periodId ?? reportMockData.selectedPeriodId
  const periodData = reportMockData.periods[periodId] ?? reportMockData.periods[reportMockData.selectedPeriodId]
  const { reliefFactors, otherReliefFactors } = periodData

  return (
    <FactorDetailPage
      title="입덧 완화요인"
      descriptionLines={['AI가 입덧 기록을 분석하여', '다온님의 입덧 완화에 도움이 된 요인들을 추출했어요']}
      variant="relief"
      topFactors={reliefFactors}
      otherFactorsTitle="그 외 완화요인"
      otherFactors={otherReliefFactors}
    />
  )
}

export default ReportRelief
