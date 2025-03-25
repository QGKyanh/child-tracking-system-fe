import { createSlice } from '@reduxjs/toolkit';

// Initial state - no localStorage usage
const initialState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // We're now cookie-based, so we just set isAuthenticated to true
      state.isAuthenticated = true;
      // Keep accessToken for backward compatibility
      state.accessToken = action.payload?.accessToken || 'cookie-based-auth';
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: state => {
      // Clear Redux state
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Export actions
export const { login, logout, setUser } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = state =>
  state.authSlice?.isAuthenticated || false;
export const selectCurrentUser = state => state.authSlice?.user || null;
export const selectAccessToken = state => state.authSlice?.accessToken || null;

export default authSlice.reducer;
