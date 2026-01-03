import { useState } from "react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/ui/passwordInput";
import { registerUser } from "../../services/api/auth";
const Register = () => {
  const navigate = useNavigate();
  const [ formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    mobile_number: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];

  const validate = () => {
    const newErrors = {};
    const mobileRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      newErrors.username = 'Required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Min 8 characters';
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Required';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords must match';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Required';
    }
    
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Required';
    }
    
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = 'Required';
    } else if (!mobileRegex.test(formData.mobile_number)) {
      newErrors.mobile_number = 'Must be 10 digits';
    }

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
        const response = await registerUser(formData);
        
        if (response.success) {
          setSuccess(true);
          setFormData({
            username: '',
            email: '',
            password: '',
            confirm_password: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            gender: '',
            date_of_birth: '',
            mobile_number: '',
          });
          // Navigate to login after 2 seconds
          setTimeout(() => {
            navigate('/auth/login');
          }, 1000);
        }
      } catch (error) {
        setApiError(error.message || 'Registration failed. Please try again.');
        setLoading(false);
      }
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For mobile number, only allow digits
    if (name === 'mobile_number') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-4xl bg-[oklch(0.22_0_0)] rounded-2xl shadow-2xl border border-[oklch(0.25_0_0)] p-6 md:p-8 max-h-[90vh] overflow-y-auto backdrop-blur-sm">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-[oklch(0.95_0_0)] mb-1">Rahul Papers</span>
          <p className="text-sm text-[oklch(0.65_0_0)]">Enterprise Resource Planning</p>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[oklch(0.98_0_0)] mb-2">Create Your Account</h2>
          <p className="text-[oklch(0.70_0_0)]">Fill in your details to get started</p>
        </div>

        {/* Error/Success Messages */}
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

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Registration successful! Redirecting to login...</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              label="First Name" 
              name="first_name" 
              value={formData.first_name} 
              onChange={handleChange} 
              error={errors.first_name} 
              required 
              placeholder="Enter your first name"
            />
            <Input 
              label="Middle Name" 
              name="middle_name" 
              value={formData.middle_name} 
              onChange={handleChange} 
              error={errors.middle_name} 
              placeholder="Enter your middle name (optional)"
            />
            <Input 
              label="Last Name" 
              name="last_name" 
              value={formData.last_name} 
              onChange={handleChange} 
              error={errors.last_name} 
              required 
              placeholder="Enter your last name"
            />
          </div>

          {/* Username and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Username" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              error={errors.username} 
              required 
              placeholder="Choose a unique username"
              autoComplete="username"
            />
            <Input 
              label="Email Address" 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              error={errors.email} 
              required 
              placeholder="your.email@example.com"
              autoComplete="email"
            />
          </div>

          {/* Gender, Date of Birth, Mobile Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">
                Gender <span className="text-red-400">*</span>
              </label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                className={`w-full px-4 py-2.5 text-sm bg-[oklch(0.30_0_0)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[oklch(0.95_0_0)] transition-all ${
                  errors.gender ? 'border-red-500' : 'border-[oklch(0.25_0_0)]'
                }`} 
                required
              >
                <option value="">Select Gender</option>
                {genderOptions.map(option => (
                  <option key={option} value={option.toLowerCase()}>{option}</option>
                ))}
              </select>
              {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[oklch(0.85_0_0)] mb-2">
                Date of Birth <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="10"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^\d]/g, '')
                    if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2)
                    if (val.length >= 5) val = val.slice(0, 5) + '/' + val.slice(5, 9)
                    setFormData(prev => ({ ...prev, date_of_birth: val }))
                    if (errors.date_of_birth) {
                      setErrors(prev => ({ ...prev, date_of_birth: '' }))
                    }
                  }}
                  placeholder="DD/MM/YYYY"
                  className={`w-full px-4 py-2.5 text-sm bg-[oklch(0.30_0_0)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[oklch(0.95_0_0)] pr-10 transition-all ${
                    errors.date_of_birth ? 'border-red-500' : 'border-[oklch(0.25_0_0)]'
                  }`}
                  required
                />
                <input
                  type="date"
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split('-')
                      setFormData(prev => ({ ...prev, date_of_birth: `${d}/${m}/${y}` }))
                    } else {
                      setFormData(prev => ({ ...prev, date_of_birth: '' }))
                    }
                    if (errors.date_of_birth) {
                      setErrors(prev => ({ ...prev, date_of_birth: '' }))
                    }
                  }}
                  className="absolute right-3 top-0 w-10 h-full opacity-0 cursor-pointer"
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.65_0_0)] pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {errors.date_of_birth && <p className="text-red-400 text-xs mt-1">{errors.date_of_birth}</p>}
            </div>
            <Input 
              label="Mobile Number" 
              type="tel" 
              name="mobile_number" 
              value={formData.mobile_number} 
              onChange={handleChange} 
              error={errors.mobile_number} 
              required 
              placeholder="10 digit mobile number"
              maxLength={10}
              autoComplete="tel"
            />
          </div>

          {/* Password and Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PasswordInput 
              label="Password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              error={errors.password} 
              required 
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
            <Input 
              label="Confirm Password" 
              type="password" 
              name="confirm_password" 
              value={formData.confirm_password} 
              onChange={handleChange} 
              error={errors.confirm_password} 
              required 
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button type="submit" loading={loading} className="w-full">
              Create Account
            </Button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-[oklch(0.25_0_0)]">
          <p className="text-center text-sm text-[oklch(0.70_0_0)]">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;