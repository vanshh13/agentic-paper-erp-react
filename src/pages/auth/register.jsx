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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-6xl bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-4 sm:p-6 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-bold text-white">Rahul Papers</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 text-center">Create Account</h2>
        <p className="text-gray-400 mb-3 sm:mb-4 text-center text-xs sm:text-sm">Register as a new employee</p>

        {apiError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg text-sm">
            Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} required />
            <Input label="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleChange} error={errors.middle_name} />
            <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} required />
          </div>

          {/* Username and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} required />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} required />
          </div>

          {/* Gender, Date of Birth, Mobile Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Gender <span className="text-red-400">*</span>
              </label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange} 
                className={`w-full px-2 py-1.5 text-sm bg-gray-800 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white ${
                  errors.gender ? 'border-red-500' : 'border-gray-700'
                }`} 
                required
              >
                <option value="">Select</option>
                {genderOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.gender && <p className="text-red-400 text-xs mt-0.5">{errors.gender}</p>}
            </div>
            <Input 
              label="Date of Birth" 
              type="date" 
              name="date_of_birth" 
              value={formData.date_of_birth} 
              onChange={handleChange} 
              error={errors.date_of_birth} 
              required 
            />
            <Input 
              label="Mobile Number" 
              type="tel" 
              name="mobile_number" 
              value={formData.mobile_number} 
              onChange={handleChange} 
              error={errors.mobile_number} 
              required 
              placeholder="10 digits"
              maxLength={10}
            />
          </div>

          {/* Password and Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <PasswordInput label="Password" name="password" value={formData.password} onChange={handleChange} error={errors.password} required placeholder="Min. 8 characters" />
            <Input label="Confirm Password" type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} error={errors.confirm_password} required />
          </div>

          <div className="flex flex-col items-center gap-2 pt-2">
            <Button type="submit" loading={loading}>Register</Button>
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-gray-300 font-medium hover:text-white transition-colors">  Sign in here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;