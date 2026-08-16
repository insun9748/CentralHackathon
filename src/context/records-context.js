import { createContext, useContext } from 'react'

export const RecordsContext = createContext(null)

// 기록을 날짜별로 묶기 위한 공통 키 포맷 (예: '2026-08-16')
// 홈에서 저장할 때, 트래커에서 날짜별로 필터링할 때 둘 다 이 포맷을 씀
export function formatDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function todayDateKey() {
  const now = new Date()
  return formatDateKey(now.getFullYear(), now.getMonth(), now.getDate())
}

export function useRecords() {
  const context = useContext(RecordsContext)
  if (!context) {
    throw new Error('useRecords must be used within a RecordsProvider')
  }
  return context
}
