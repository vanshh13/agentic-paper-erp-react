import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login success
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token || null
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },

    // Login failure
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
    },

    // Register success
    registerSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token || null
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },

    // Register failure
    registerFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.isAuthenticated = false
    },

    // Logout
    logoutSuccess: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },

    // Set loading
    setLoading: (state, action) => {
      state.loading = action.payload
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  logoutSuccess,
  setLoading,
  clearError,
} = userSlice.actions

export default userSlice.reducer
