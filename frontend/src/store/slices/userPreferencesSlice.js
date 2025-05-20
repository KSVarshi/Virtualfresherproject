import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import api from '../../services/api'

// Fetch user preferences
export const fetchUserPreferences = createAsyncThunk(
  'userPreferences/fetchUserPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/preferences')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user preferences'
      )
    }
  }
)

// Update user preferences
export const updateUserPreferences = createAsyncThunk(
  'userPreferences/updateUserPreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/preferences', preferences)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user preferences'
      )
    }
  }
)

const initialState = {
  country: '',
  preferredVendors: [],
  gender: '',
  apparelSizes: {
    tops: '',
    bottoms: '',
    shoes: '',
  },
  priceRange: {
    min: 0,
    max: 1000,
  },
  preferredCategories: [],
  shippingPreferences: [],
  loading: false,
  error: null,
}

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    clearPreferences: (state) => {
      Object.assign(state, initialState)
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user preferences
      .addCase(fetchUserPreferences.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.loading = false
        // Map API response to state
        Object.assign(state, action.payload)
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update user preferences
      .addCase(updateUserPreferences.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.loading = false
        // Map API response to state
        Object.assign(state, action.payload)
        toast.success('Preferences updated successfully!')
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
  },
})

export const { clearPreferences } = userPreferencesSlice.actions

export default userPreferencesSlice.reducer

// Selectors
export const selectUserPreferences = (state) => state.userPreferences
export const selectUserPreferencesLoading = (state) => state.userPreferences.loading
export const selectUserPreferencesError = (state) => state.userPreferences.error