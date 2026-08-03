import axios from 'axios'
import { getAuth } from 'firebase/auth'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Tunable defaults
const DEFAULT_TIMEOUT = 15000 // 15s
const MAX_GET_RETRIES = 2
const RETRY_BASE_DELAY_MS = 300

const api = axios.create({
  baseURL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach Firebase ID token (if any) to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth()
      const user = auth.currentUser
      if (user) {
        const token = await user.getIdToken()
        if (config && config.headers) {
          config.headers.Authorization = 'Bearer ' + token
        }
      }
    } catch {
      // ignore - unauthenticated or firebase not ready
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: token refresh on 401 and safe retry for idempotent GETs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config
    if (!originalRequest) return Promise.reject(error)

    // --- Token refresh on 401 ---
    const status = error.response?.status
    if (status === 401 && !(originalRequest as any)._retryAuth) {
      ;(originalRequest as any)._retryAuth = true
      try {
        const auth = getAuth()
        const user = auth.currentUser
        if (user) {
          const freshToken = await user.getIdToken(true)
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = 'Bearer ' + freshToken
          } else {
            originalRequest.headers = { Authorization: 'Bearer ' + freshToken }
          }
          return api(originalRequest)
        }
      } catch (e) {
        // token refresh failed; fallthrough to reject
      }
    }

    // --- Safe retry for GET/network/5xx errors ---
    const method = (originalRequest.method || '').toLowerCase()
    const shouldRetry =
      method === 'get' && (!error.response || (error.response.status >= 500 && error.response.status < 600))

    if (shouldRetry) {
      ;(originalRequest as any)._retryCount = (originalRequest as any)._retryCount || 0
      if ((originalRequest as any)._retryCount < MAX_GET_RETRIES) {
        ;(originalRequest as any)._retryCount += 1
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, (originalRequest as any)._retryCount - 1)
        await new Promise((res) => setTimeout(res, delay))
        return api(originalRequest)
      }
    }

    // Preserve original axios error for callers; add structured debug info if needed
    return Promise.reject(error)
  },
)

export default api
