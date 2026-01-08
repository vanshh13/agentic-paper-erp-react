import { useState } from "react";
import { useDispatch } from 'react-redux';
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/ui/password-input";
import { loginUser } from "../../services/api/auth";
import { loginSuccess, loginFailure, setLoading } from '../../store/slices/user-slice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
      username: '',
      password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
  
    const validate = () => {
      const newErrors = {};
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (!formData.password) newErrors.password = 'Password is required';
      return newErrors;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setApiError('');
      
      const newErrors = validate();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
  
      setLoading(true);
      try {
        const response = await loginUser({
          username_or_email: formData.username,
          password: formData.password,
        });
        if (response.success && response.data?.user) {
          // User data is stored in localStorage by loginUser function
          // Navigate to dashboard
          const user = response.data?.user || JSON.parse(localStorage.getItem('user'));
          const token = response.data?.token || JSON.parse(localStorage.getItem('token'));
          dispatch(loginSuccess({ user, token }));
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
          const message =
            error?.response?.data?.error?.message ||
            error?.response?.data?.message ||
            error?.message ||
            'Invalid credentials'
        
          dispatch(loginFailure(message))        
      } finally {
        setLoading(false);
      }
    };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-8">
          <div className="max-w-md w-full">
            <div className="bg-[oklch(0.22_0_0)] rounded-2xl shadow-2xl p-8 md:p-10 border border-[oklch(0.25_0_0)] backdrop-blur-sm">
              {/* Logo and Branding */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-[oklch(0.95_0_0)] mb-1">Rahul Papers</span>
                <p className="text-sm text-[oklch(0.65_0_0)]">Enterprise Resource Planning</p>
              </div>
    
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[oklch(0.98_0_0)] mb-2">Welcome Back</h2>
                <p className="text-[oklch(0.70_0_0)]">Sign in to continue to your account</p>
              </div>
    
              {/* Error Message */}
              {apiError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{apiError}</span>
                  </div>
                </div>
              )}
    
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Username or Email"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  required
                  autoComplete="username"
                  placeholder="Enter your username or email"
                />
                
                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
    
                <div className="pt-2">
                  <Button type="submit" loading={loading} className="w-full">
                    Sign In
                  </Button>
                </div>
              </form>
    
              {/* Footer Link */}
              <div className="mt-8 pt-6 border-t border-[oklch(0.25_0_0)]">
                <p className="text-center text-sm text-[oklch(0.70_0_0)]">
                  Don't have an account?{' '}
                  <Link to="/auth/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default Login;