import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('@recruitment:token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@recruitment:token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { apiClient }
