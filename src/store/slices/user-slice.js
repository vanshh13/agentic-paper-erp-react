// src/store/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getCurrentUser, isAuthenticated } from '../../services/api/auth';

const initialState = {
  user: getCurrentUser(),
  isAuthenticated: isAuthenticated(),
  loading: false,
  error: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Sync with localStorage - call this after login/register in authService
    syncUserFromStorage: (state) => {
      state.user = getCurrentUser();
      state.isAuthenticated = isAuthenticated();
      state.loading = false;
      console.log('Synced user from storage:', state.user);
    },
    
    // Login success - update state
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      console.log('Login success in Redux:', action.payload.user);
    },
    
    // Login failure
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      console.error('Login failure:', action.payload);
    },
    
    // Register success
    registerSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    
    // Register failure
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    
    // Logout
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      console.log('Logout Success.');
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear credentials
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { 
  syncUserFromStorage,
  loginSuccess, 
  loginFailure,
  registerSuccess,
  registerFailure,
  logoutSuccess,
  setLoading,
  clearError,
  clearCredentials 
} = userSlice.actions;

export default userSlice.reducer;