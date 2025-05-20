import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import api from '../../services/api'

// Fetch cart from server
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      )
    }
  }
)

// Add item to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/items', { productId, quantity })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add item to cart'
      )
    }
  }
)

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart item'
      )
    }
  }
)

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      await api.delete(`/cart/items/${itemId}`)
      return itemId
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove item from cart'
      )
    }
  }
)

// Get optimized cart recommendations
export const getCartRecommendations = createAsyncThunk(
  'cart/getRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart/recommendations')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get cart recommendations'
      )
    }
  }
)

// Apply coupon to cart
export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/coupon', { code: couponCode })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to apply coupon'
      )
    }
  }
)

const initialState = {
  items: [],
  recommendations: [],
  subtotal: 0,
  discount: 0,
  total: 0,
  loading: false,
  addingToCart: false,
  error: null,
  couponCode: null,
  couponApplied: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = []
      state.recommendations = []
      state.subtotal = 0
      state.discount = 0
      state.total = 0
      state.couponCode = null
      state.couponApplied = false
    },
    calculateTotals: (state) => {
      state.subtotal = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      state.total = state.subtotal - state.discount
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.subtotal = action.payload.subtotal
        state.discount = action.payload.discount || 0
        state.total = action.payload.total
        state.couponCode = action.payload.couponCode || null
        state.couponApplied = !!action.payload.couponCode
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.addingToCart = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addingToCart = false
        state.items = action.payload.items
        state.subtotal = action.payload.subtotal
        state.discount = action.payload.discount || 0
        state.total = action.payload.total
        toast.success('Item added to cart!')
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addingToCart = false
        state.error = action.payload
        toast.error(action.payload)
      })
      
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.subtotal = action.payload.subtotal
        state.discount = action.payload.discount || 0
        state.total = action.payload.total
        toast.success('Cart updated!')
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
      
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(
          (item) => item.id !== action.payload
        )
        // Recalculate totals
        state.subtotal = state.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
        state.total = state.subtotal - state.discount
        toast.success('Item removed from cart')
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
      
      // Get cart recommendations
      .addCase(getCartRecommendations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCartRecommendations.fulfilled, (state, action) => {
        state.loading = false
        state.recommendations = action.payload
      })
      .addCase(getCartRecommendations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Apply coupon
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false
        state.discount = action.payload.discount
        state.total = state.subtotal - state.discount
        state.couponCode = action.payload.couponCode
        state.couponApplied = true
        toast.success('Coupon applied successfully!')
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload)
      })
  },
})

export const { clearCart, calculateTotals } = cartSlice.actions

export default cartSlice.reducer

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartTotal = (state) => state.cart.total
export const selectCartSubtotal = (state) => state.cart.subtotal
export const selectCartDiscount = (state) => state.cart.discount
export const selectCartLoading = (state) => state.cart.loading
export const selectAddingToCart = (state) => state.cart.addingToCart
export const selectCartRecommendations = (state) => state.cart.recommendations
export const selectCartItemCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0)