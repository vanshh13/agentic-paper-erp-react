import { useState } from "react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/ui/passwordInput";

const Login = () => {
    const navigate = useNavigate();
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
      try{
        const username = formData.username;
        const password = formData.password;
        if(username === 'user' && password === 'user123'){
          navigate('/dashboard');
        }else{
          setApiError('Invalid username or password');
        }
      }catch(error){
        setApiError(error.message);
      }finally{
        setLoading(false);
      }
    //   try {
    //     const response = await fetch('/api/auth/login', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(formData),
    //     });
        
    //     if (response.ok) {
    //       const data = await response.json();
    //       localStorage.setItem('authToken', data.token || 'mock-token');
    //       navigate('/');
    //     } else {
    //       setApiError('Invalid username or password');
    //     }
    //   } catch (error) {
    //     localStorage.setItem('authToken', 'mock-token');
    //     navigate('/');
    //   } finally {
    //     setLoading(false);
    //   }
    };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">Rahul Papers</span>
              </div>
    
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Welcome Back</h2>
              <p className="text-gray-400 mb-6 text-center">Sign in to your account</p>
    
              {apiError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">
                  {apiError}
                </div>
              )}
    
              <form onSubmit={handleSubmit}>
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  required
                  autoComplete="username"
                />
                <div className="mb-4"></div>
                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  autoComplete="current-password"
                />
    
                <div className="flex flex-col items-center gap-2 pt-2">
                  <Button type="submit" loading={loading}>
                    Sign In
                  </Button>
                </div>
              </form>
    
              <p className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-gray-400 font-medium hover:text-gray-300 transition-colors">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      );
    };

    export default Login;