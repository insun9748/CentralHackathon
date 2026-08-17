import { addDays, toDateString } from './date.js'

const PERIOD_DAYS = { week1: 6, week2: 13, month1: 29 }

// periodId + (직접 지정한 경우) customRange로부터 리포트 조회에 쓸 { startDate, endDate } 문자열을 만든다
export function resolvePeriodRange(periodId, customRange) {
  const today = new Date()

  if (periodId === 'custom') {
    if (!customRange?.start) return null
    return {
      startDate: toDateString(customRange.start),
      endDate: toDateString(customRange.end ?? customRange.start),
    }
  }

  const days = PERIOD_DAYS[periodId] ?? PERIOD_DAYS.week1
  return {
    startDate: toDateString(addDays(today, -days)),
    endDate: toDateString(today),
  }
}
