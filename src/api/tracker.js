import { apiClient, unwrap } from './client.js'

export async function getTracker() {
  const response = await apiClient.get('/tracker')
  return unwrap(response) // { currentWeek, stage, caution, foodInfo, bodyChange }
}

export async function getCalendar(year, month) {
  const response = await apiClient.get('/tracker/calendar', { params: { year, month } })
  return unwrap(response) // { year, month, days: [{date, hasRecord, averageIntensity}] }
}
