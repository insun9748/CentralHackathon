import { apiClient, unwrap } from './client.js'

export async function getReport(startDate, endDate) {
  const response = await apiClient.get('/reports', { params: { startDate, endDate } })
  return unwrap(response) // ReportResponse data
}
