import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, selectAuthLoading } from '../../store/slices/authSlice'
import Loading from '../ui/Loading'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading = useSelector(selectAuthLoading)
  const location = useLocation()

  // Show loading spinner while checking authentication status
  if (loading) {
    return <Loading />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Store the location they were trying to access so we can redirect after login
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  // Render the protected component
  return children
}

export default ProtectedRoute