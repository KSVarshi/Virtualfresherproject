import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import api from '../../services/api'

// Check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token)
    return decoded.exp * 1000 < Date.now()
  } catch (err) {
    return true
  }
}

// Check if user is logged in on app load
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token')
      return rejectWithValue('Token expired or not found')
    }

    try {
      // Get user data from token
      const decoded = jwtDecode(token)
      // Set token in axios headers for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      return { user: decoded, token }
    } catch (error) {
      localStorage.removeItem('token')
      return rejectWithValue(error.message)
    }
  }
)

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("log in ", credentials)
      const response = await api.post('/auth/login', credentials)
      const { token, user } = response.data
      
      // Store token in localStorage
      localStorage.setItem('token', token)
      
      // Set token in axios headers for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      )
    }
  }
)

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { token, user } = response.data
      
      // Store token in localStorage
      localStorage.setItem('token', token)
      
      // Set token in axios headers for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please try again.'
      )
    }
  }
)

// Forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ username }, { rejectWithValue }) => {
    try {
      let name = username;
      console.log(username);
      const response = await api.post('/auth/forgot-password', { name })
      
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to process request. Please try again.'
      )
    }
  }
)

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reset password. Please try again.'
      )
    }
  }
)

// Logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    // Remove token from localStorage
    localStorage.removeItem('token')
    
    // Remove token from axios headers
    delete api.defaults.headers.common['Authorization']
    
    return null
  }
)

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        toast.success('Logged in successfully!')
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        toast.success('Registered successfully!')
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
      
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
        toast.success('Password reset instructions sent!')
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
      
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
        toast.success('Password reset successful!')
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        toast.info('Logged out successfully')
      })
  },
})

export const { clearError } = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error