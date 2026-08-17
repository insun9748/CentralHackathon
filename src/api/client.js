import axios from 'axios'
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from './tokenStorage.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 로그인/재발급 요청 자체는 401을 재발급 대상으로 취급하지 않기 위한 표시
const NO_RETRY_PATHS = ['/auth/login', '/auth/signup', '/auth/reissue']

let isRefreshing = false
let pendingQueue = []

function resolveQueue(error, accessToken) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(accessToken)
  })
  pendingQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error
    const isAuthEndpoint = config && NO_RETRY_PATHS.some((path) => config.url?.includes(path))

    if (!response || response.status !== 401 || isAuthEndpoint || config._retried) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearTokens()
      return Promise.reject(error)
    }

    config._retried = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then((accessToken) => {
        config.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(config)
      })
    }

    isRefreshing = true

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/reissue`, { refreshToken })
      const accessToken = data.data.accessToken
      setAccessToken(accessToken)
      resolveQueue(null, accessToken)
      config.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(config)
    } catch (refreshError) {
      resolveQueue(refreshError, null)
      clearTokens()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export function unwrap(response) {
  return response.data.data
}

export function getErrorMessage(error, fallback = '요청 처리 중 문제가 발생했습니다.') {
  return error?.response?.data?.message || fallback
}

// 백엔드가 내려주는 프로필 이미지 등의 상대 경로(예: '/profile/abc.png')를 절대 URL로 변환
export function resolveMediaUrl(path) {
  if (!path) return null
  if (/^https?:\/\//.test(path)) return path
  return `${BASE_URL}${path}`
}
