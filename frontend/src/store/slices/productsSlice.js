import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// Fetch all products
console.log("product slice")
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      // Convert filters to query parameters
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      const { pagination } = getState().products;
      params.append("page", pagination.currentPage)
      console.log("params: " ,params.toString())
      console.log("In fetch product")
      const response = await api.get(`/products?${params.toString()}`)
      //const response = await api.get('/products')
      console.log("params: " ,params.toString())
      console.log("product data", response.data)
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      )
    }
  }
)

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue, getState }) => {
    try {
      // Check if we already have the product in state to avoid redundant API calls
      const existingProduct = getState().products.products.find(
        (p) => p.id === productId
      )
      
      if (existingProduct && !getState().products.forceRefresh) {
        return existingProduct
      }
      
      const response = await api.get(`/products/${productId}`)
      console.log("product by id", response.data);
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product'
      )
    }
  }
)

// Fetch product price comparisons
export const fetchPriceComparisons = createAsyncThunk(
  'products/fetchPriceComparisons',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}/price-comparison`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch price comparisons'
      )
    }
  }
)

// Fetch recommended products
export const fetchRecommendedProducts = createAsyncThunk(
  'products/fetchRecommendedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/recommendations')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch recommendations'
      )
    }
  }
)

// Fetch related products
export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelatedProducts',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/recommendation/${productId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch related products'
      )
    }
  }
)

// Fetch product categories
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/categories')
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      )
    }
  }
)

const initialState = {
  products: [],
  filteredProducts: [],
  currentProduct: null,
  recommendedProducts: [],
  relatedProducts: [],
  priceComparisons: [],
  categories: [],
  loading: false,
  error: null,
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: 'popularity',
    vendor: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  },
  forceRefresh: false,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      }
      state.pagination.currentPage = 1 // Reset to first page on filter change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
      state.pagination.currentPage = 1
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
    resetProduct: (state) => {
      state.currentProduct = null
      state.priceComparisons = []
      state.relatedProducts = []
    },
    forceProductRefresh: (state) => {
      state.forceRefresh = true
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.filteredProducts = action.payload.products
        state.pagination = {
          ...state.pagination,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalResults,
        }
        
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload
        state.forceRefresh = false
        
        // Update this product in the products array if it exists
        const index = state.products.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch price comparisons
      .addCase(fetchPriceComparisons.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPriceComparisons.fulfilled, (state, action) => {
        state.loading = false
        state.priceComparisons = action.payload
      })
      .addCase(fetchPriceComparisons.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch recommended products
      .addCase(fetchRecommendedProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.loading = false
        state.recommendedProducts = action.payload
      })
      .addCase(fetchRecommendedProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch related products
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.loading = false
        state.relatedProducts = action.payload
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  setFilter,
  clearFilters,
  setPage,
  resetProduct,
  forceProductRefresh,
} = productsSlice.actions

export default productsSlice.reducer

// Selectors
export const selectAllProducts = (state) => state.products.products
export const selectFilteredProducts = (state) => state.products.filteredProducts
export const selectCurrentProduct = (state) => state.products.currentProduct
export const selectRecommendedProducts = (state) => state.products.recommendedProducts
export const selectRelatedProducts = (state) => state.products.relatedProducts
export const selectPriceComparisons = (state) => state.products.priceComparisons
export const selectCategories = (state) => state.products.categories
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsError = (state) => state.products.error
export const selectFilters = (state) => state.products.filters
export const selectPagination = (state) => state.products.pagination