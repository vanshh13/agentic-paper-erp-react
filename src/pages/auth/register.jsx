import { useState } from "react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/ui/passwordInput";
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', official_email: '', personal_email: '', password: '',
    confirm_password: '', employee_code: '', first_name: '', middle_name: '',
    last_name: '', mobile_number: '', date_of_joining: '', user_role: '',
    employment_type: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const userRoles = ['Admin', 'Manager', 'Employee', 'HR', 'Finance'];
  const employmentTypes = ['Full-Time', 'Part-Time', 'Contract', 'Intern'];

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.username.trim()) newErrors.username = 'Required';
    if (!formData.official_email.trim()) {
      newErrors.official_email = 'Required';
    } else if (!emailRegex.test(formData.official_email)) {
      newErrors.official_email = 'Invalid format';
    }
    if (formData.personal_email && !emailRegex.test(formData.personal_email)) {
      newErrors.personal_email = 'Invalid format';
    }
    if (!formData.password) {
      newErrors.password = 'Required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Min 8 chars';
    }
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Required';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Must match';
    }
    if (!formData.employee_code.trim()) newErrors.employee_code = 'Required';
    if (!formData.first_name.trim()) newErrors.first_name = 'Required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Required';
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = 'Required';
    } else if (!mobileRegex.test(formData.mobile_number)) {
      newErrors.mobile_number = '10 digits';
    }
    if (!formData.date_of_joining) newErrors.date_of_joining = 'Required';
    if (!formData.user_role) newErrors.user_role = 'Required';
    if (!formData.employment_type) newErrors.employment_type = 'Required';

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

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <Input label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} required />
            <Input label="Employee Code" name="employee_code" value={formData.employee_code} onChange={handleChange} error={errors.employee_code} required />
            <Input label="Official Email" type="email" name="official_email" value={formData.official_email} onChange={handleChange} error={errors.official_email} required />
            <Input label="Personal Email" type="email" name="personal_email" value={formData.personal_email} onChange={handleChange} error={errors.personal_email} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} required />
            <Input label="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleChange} error={errors.middle_name} />
            <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input label="Mobile Number" type="tel" name="mobile_number" value={formData.mobile_number} onChange={handleChange} error={errors.mobile_number} required placeholder="10 digits" />
            <Input label="Date of Joining" type="date" name="date_of_joining" value={formData.date_of_joining} onChange={handleChange} error={errors.date_of_joining} required />
            
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                User Role <span className="text-red-400">*</span>
              </label>
              <select name="user_role" value={formData.user_role} onChange={handleChange} className={`w-full px-2 py-1.5 text-sm bg-gray-800 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white ${errors.user_role ? 'border-red-500' : 'border-gray-700'}`} required>
                <option value="">Select</option>
                {userRoles.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
              {errors.user_role && <p className="text-red-400 text-xs mt-0.5">{errors.user_role}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Employment Type <span className="text-red-400">*</span>
              </label>
              <select name="employment_type" value={formData.employment_type} onChange={handleChange} className={`w-full px-2 py-1.5 text-sm bg-gray-800 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white ${errors.employment_type ? 'border-red-500' : 'border-gray-700'}`} required>
                <option value="">Select</option>
                {employmentTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              {errors.employment_type && <p className="text-red-400 text-xs mt-0.5">{errors.employment_type}</p>}
            </div>
          </div>

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