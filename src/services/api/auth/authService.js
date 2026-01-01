import axios from 'axios';
import { API_BASE_URL } from '../config';

/**
 * Authentication Service
 * Handles all auth-related API calls to backend
 */

// Create axios client with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth-service/register', {
      first_name: userData.first_name,
      middle_name: userData.middle_name || null,
      last_name: userData.last_name,
      username: userData.username.toLowerCase(),
      email: userData.email.toLowerCase(),
      gender: userData.gender?.toLowerCase() || null,
      date_of_birth: userData.date_of_birth || null,
      mobile_number: userData.mobile_number,
      password: userData.password,
    });

    // Store user data in localStorage after successful registration
    // Backend response: { success: true, data: { success, message, user: {...} }, timestamp, requestId }
    const userToStore = response.data?.data?.user;
    if (userToStore) {
      localStorage.setItem('user', JSON.stringify(userToStore));
      console.log('Stored user to localStorage:', userToStore);
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Registration error');
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth-service/login', {
      username_or_email: credentials.username_or_email || credentials.username,
      password: credentials.password,
    });

    // Store user data in localStorage (token is in HTTP-only cookie)
    // Backend response: { success: true, data: { success, message, user: {...} }, timestamp, requestId }
    const userToStore = response.data?.data?.user;
    if (userToStore) {
      localStorage.setItem('user', JSON.stringify(userToStore));
      console.log('Stored user to localStorage:', userToStore);
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Login error');
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await apiClient.post('/auth-service/logout');

    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');

    return { success: true };
  } catch (error) {
    // Even if logout fails, clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    throw new Error(error.response?.data?.message || error.message || 'Logout error');
  }
};

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
