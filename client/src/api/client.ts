import axios from "axios"

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 1000,
})

/**
 * This interceptor runs after any request and checks if the accessToken
 * is still valid. If not valid, either a new token is generated or the
 * user will be prompted with logging in again.
 */
axiosClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    const status = error.response?.status
    const message = error.response?.data?.message
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      if (message === "Token expired") {
        try {
          await axiosClient.post('/api/refreshToken', {}, { withCredentials: true })
          return axiosClient(originalRequest)
        } catch (refreshError) {
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      } else if (message === "No token provided" || message === "Token is not valid") {
        window.location.href = '/login'
        return Promise.reject(error)
      } else {
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient