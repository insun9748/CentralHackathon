import { apiClient, unwrap } from './client.js'

export async function createRecord({ timeCategoryId, intensityId, recordDateTime, memo }) {
  const response = await apiClient.post('/records', { timeCategoryId, intensityId, recordDateTime, memo })
  return unwrap(response) // { recordId }
}

export async function getRecords(date) {
  const response = await apiClient.get('/records', { params: date ? { date } : undefined })
  return unwrap(response) // RecordResponse[]
}

export async function getRecord(recordId) {
  const response = await apiClient.get(`/records/${recordId}`)
  return unwrap(response) // RecordResponse
}

export function updateRecord(recordId, payload) {
  return apiClient.patch(`/records/${recordId}`, payload)
}

export function deleteRecord(recordId) {
  return apiClient.delete(`/records/${recordId}`)
}
