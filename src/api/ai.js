import { apiClient, unwrap } from './client.js'

export async function analyzeRecord(recordId) {
  const response = await apiClient.post(`/records/${recordId}/analysis`)
  return unwrap(response) // AnalysisResponse data
}
