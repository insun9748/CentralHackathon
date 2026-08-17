import { apiClient, unwrap } from './client.js'

export function signup({ email, password, confirmPassword }) {
  return apiClient.post('/auth/signup', { email, password, confirmPassword })
}

export async function login({ email, password }) {
  const response = await apiClient.post('/auth/login', { email, password })
  return unwrap(response) // { accessToken, refreshToken }
}

export async function reissue(refreshToken) {
  const response = await apiClient.post('/auth/reissue', { refreshToken })
  return unwrap(response) // { accessToken }
}

export function logout(refreshToken) {
  return apiClient.post('/auth/logout', { refreshToken })
}
