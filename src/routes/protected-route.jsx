import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()

  // auth slice (matches store)
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
