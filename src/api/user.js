import { apiClient, unwrap } from './client.js'

export async function getMe() {
  const response = await apiClient.get('/users/me')
  return unwrap(response) // { nickname, pregnancyWeek, dueDate, profileImage }
}

export function updateMe({ nickname, pregnancyWeek, dueDate }, profileImageFile) {
  const formData = new FormData()
  formData.append(
    'request',
    new Blob([JSON.stringify({ nickname, pregnancyWeek, dueDate })], { type: 'application/json' })
  )
  if (profileImageFile) {
    formData.append('profileImage', profileImageFile)
  }
  return apiClient.patch('/users/me', formData)
}

export async function getSettings() {
  const response = await apiClient.get('/users/me/settings')
  return unwrap(response) // { recordNotification, reportNotification, microphone }
}

export function updateSettings({ recordNotification, reportNotification, microphone }) {
  return apiClient.patch('/users/me/settings', { recordNotification, reportNotification, microphone })
}
