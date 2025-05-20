import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import UserProfile from './pages/UserProfile'
import UserPreferences from './pages/UserPreferences'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { checkAuthStatus } from './store/slices/authSlice'
import VirtualTryOn from './pages/VirtualTryOn'
import NotFound from './pages/NotFound'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Check if user is already logged in on app load
    dispatch(checkAuthStatus())
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        
        {/* Protected Routes */}
        <Route path="cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="preferences" element={
          <ProtectedRoute>
            <UserPreferences />
          </ProtectedRoute>
        } />
        <Route path="virtual-try-on/:productId" element={
          <ProtectedRoute>
            <VirtualTryOn />
          </ProtectedRoute>
        } />
        
        {/* 404 and redirects */}
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}

export default App