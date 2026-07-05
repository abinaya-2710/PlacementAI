/**
 * services/api.ts — Base Axios instance for PlacePrep AI.
 *
 * Features:
 *  - Base URL from env (defaults to http://localhost:5000/api)
 *  - Automatically attaches JWT access token from localStorage
 *  - Automatically refreshes the access token on 401 responses
 *  - Queues concurrent requests during a token refresh
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

// ── Constants ──────────────────────────────────────────────────────────────────
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

export const TOKEN_KEY         = 'placeprep_access_token'
export const REFRESH_TOKEN_KEY = 'placeprep_refresh_token'

// ── Token helpers ──────────────────────────────────────────────────────────────
export const tokenStorage = {
  getAccess:      ()          => localStorage.getItem(TOKEN_KEY),
  getRefresh:     ()          => localStorage.getItem(REFRESH_TOKEN_KEY),
  setAccess:      (t: string) => localStorage.setItem(TOKEN_KEY, t),
  setRefresh:     (t: string) => localStorage.setItem(REFRESH_TOKEN_KEY, t),
  setTokens:      (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_KEY, access)
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  },
  clearAll:       () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

// ── Create Axios instance ──────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ── Request interceptor — attach access token ──────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenStorage.getAccess()
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor — auto-refresh on 401 ────────────────────────────────
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject:  (reason: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else       resolve(token as string)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean }

    // If 401 and not already retrying and not the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh') &&
      !original.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (original.headers) original.headers['Authorization'] = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry  = true
      isRefreshing     = true

      const refreshToken = tokenStorage.getRefresh()
      if (!refreshToken) {
        isRefreshing = false
        tokenStorage.clearAll()
        window.dispatchEvent(new Event('auth:logout'))
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        )
        const newToken = data.data.access_token
        tokenStorage.setAccess(newToken)
        processQueue(null, newToken)
        if (original.headers) original.headers['Authorization'] = `Bearer ${newToken}`
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        tokenStorage.clearAll()
        window.dispatchEvent(new Event('auth:logout'))
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api
