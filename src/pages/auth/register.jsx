import { useState } from "react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      username: '',
      official_email: '',
      personal_email: '',
      password: '',
      confirm_password: '',
      employee_code: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      mobile_number: '',
      date_of_joining: '',
      user_role: '',
      employment_type: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
  
    const userRoles = ['Admin', 'Manager', 'Employee', 'HR', 'Finance'];
    const employmentTypes = ['Full-Time', 'Part-Time', 'Contract', 'Intern'];
  
    const validate = () => {
      const newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^[0-9]{10}$/;
  
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (!formData.official_email.trim()) {
        newErrors.official_email = 'Official email is required';
      } else if (!emailRegex.test(formData.official_email)) {
        newErrors.official_email = 'Invalid email format';
      }
      if (formData.personal_email && !emailRegex.test(formData.personal_email)) {
        newErrors.personal_email = 'Invalid email format';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (!formData.confirm_password) {
        newErrors.confirm_password = 'Please confirm password';
      } else if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match';
      }
      if (!formData.employee_code.trim()) newErrors.employee_code = 'Employee code is required';
      if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
      if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
      if (!formData.mobile_number.trim()) {
        newErrors.mobile_number = 'Mobile number is required';
      } else if (!mobileRegex.test(formData.mobile_number)) {
        newErrors.mobile_number = 'Invalid mobile number (10 digits required)';
      }
      if (!formData.date_of_joining) newErrors.date_of_joining = 'Date of joining is required';
      if (!formData.user_role) newErrors.user_role = 'User role is required';
      if (!formData.employment_type) newErrors.employment_type = 'Employment type is required';
  
      return newErrors;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      const newErrors = validate();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
  
      setLoading(true);
  
    //   try {
    //     const response = await fetch('/api/auth/register', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(formData),
    //     });
  
    //     if (response.ok) {
    //       setSuccess(true);
    //       navigate('/auth/login');
    //     } else {
    //       setSuccess(false);
    //       setErrors({});
    //       setLoading(false);
    //     }
    //   } catch (error) {
    //     setSuccess(false);
    //     setErrors({});
    //     setLoading(false);
    //   }
    navigate('/auth/login');
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    };
  
    if (success) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-2xl p-8 text-center border border-gray-800">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
            <p className="text-gray-400">Redirecting to login page...</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gray-950 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">Rahul Papers</span>
            </div>
  
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Create Account</h2>
            <p className="text-gray-400 mb-6 text-center">Register as a new employee</p>
  
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-800">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Input
                    label="Employee Code"
                    type="text"
                    name="employee_code"
                    value={formData.employee_code}
                    onChange={handleChange}
                    error={errors.employee_code}
                    required
                  />
                  <Input
                    label="Official Email"
                    type="email"
                    name="official_email"
                    value={formData.official_email}
                    onChange={handleChange}
                    error={errors.official_email}
                    required
                    autoComplete="email"
                  />
                  <Input
                    label="Personal Email"
                    type="email"
                    name="personal_email"
                    value={formData.personal_email}
                    onChange={handleChange}
                    error={errors.personal_email}
                    autoComplete="email"
                  />
                </div>
              </div>
  
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-800">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    error={errors.first_name}
                    required
                    autoComplete="given-name"
                  />
                  <Input
                    label="Middle Name"
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    error={errors.middle_name}
                    autoComplete="additional-name"
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    error={errors.last_name}
                    required
                    autoComplete="family-name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Mobile Number"
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    error={errors.mobile_number}
                    required
                    placeholder="10-digit number"
                    autoComplete="tel"
                  />
                  <Input
                    label="Date of Joining"
                    type="date"
                    name="date_of_joining"
                    value={formData.date_of_joining}
                    onChange={handleChange}
                    error={errors.date_of_joining}
                    required
                  />
                </div>
              </div>
  
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-800">Employment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      User Role <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="user_role"
                      value={formData.user_role}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white ${
                        errors.user_role ? 'border-red-500' : 'border-gray-700'
                      }`}
                      required
                    >
                      <option value="">Select Role</option>
                      {userRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    {errors.user_role && <p className="text-red-400 text-xs mt-1">{errors.user_role}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Employment Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white ${
                        errors.employment_type ? 'border-red-500' : 'border-gray-700'
                      }`}
                      required
                    >
                      <option value="">Select Type</option>
                      {employmentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.employment_type && <p className="text-red-400 text-xs mt-1">{errors.employment_type}</p>}
                  </div>
                </div>
              </div>
  
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-800">Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    error={errors.confirm_password}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
  
              <Button type="submit" loading={loading}>
                Register
              </Button>
            </form>
  
            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/auth/login" className="tex t-gray-400 font-medium hover:text-gray-300 transition-colors">
              Sign in here
            </Link>
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Register;