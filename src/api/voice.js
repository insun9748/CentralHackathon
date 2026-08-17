import { apiClient, unwrap } from './client.js'

export async function convertVoice(audioBlob) {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')
  const response = await apiClient.post('/records/voice', formData)
  return unwrap(response) // { timeCategoryId, intensityId, memo, originalText }
}
