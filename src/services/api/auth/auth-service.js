import Http from '../../http'

// REGISTER
export const registerUser = (userData) => {
  return Http.post({
    url: '/auth-service/register',
    data: {
      first_name: userData.first_name,
      middle_name: userData.middle_name || null,
      last_name: userData.last_name,
      username: userData.username.toLowerCase(),
      email: userData.email.toLowerCase(),
      gender: userData.gender?.toLowerCase() || null,
      date_of_birth: userData.date_of_birth || null,
      mobile_number: userData.mobile_number,
      password: userData.password,
    },
    messageSettings: {
      successMessage: 'Registration successful. Please login.',
      errorMessage: 'Registration failed.',
    },
  })
}

// LOGIN
export const loginUser = (credentials) => {
  return Http.post({
    url: '/auth-service/login',
    data: {
      username_or_email:
        credentials.username_or_email || credentials.username,
      password: credentials.password,
    },
    messageSettings: {
      successMessage: 'Login successful',
      errorMessage: 'Invalid username or password',
    },
  })
}

// LOGOUT
export const logoutUser = () => {
  return Http.post({
    url: '/auth-service/logout',
    messageSettings: {
      successMessage: 'Logged out successfully',
      errorMessage: 'Logout failed',
    },
  })
}


// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('user');
};

// Clear auth data (for security)
export const clearAuthData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
};
