import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api/auth';

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
