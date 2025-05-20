import axios from 'axios'
import { toast } from 'react-toastify'

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Replace with your actual API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle expired token or unauthorized access
    if (error.response && error.response.status === 401) {
      // Clear token from localStorage
      localStorage.removeItem('token')
      
      // Show toast notification
      toast.error('Your session has expired. Please log in again.')
      
      // Redirect to login page
      window.location.href = '/login'
    }
    
    // Handle server errors
    if (error.response && error.response.status >= 500) {
      toast.error('Server error. Please try again later.')
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.')
    }
    
    return Promise.reject(error)
  }
)

export default api