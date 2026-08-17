function pad(n) {
  return String(n).padStart(2, '0')
}

// 백엔드 LocalDateTime 필드(offset 없는 ISO local date-time)에 맞춰 'Z'를 붙이지 않는다
export function toLocalDateTimeString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function toDateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
