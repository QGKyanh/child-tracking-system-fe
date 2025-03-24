/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

// Safely parse JSON from localStorage
const safelyParseJSON = key => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage:`, e);
    return null;
  }
};

const accessToken = safelyParseJSON('accessToken');
const user = safelyParseJSON('user');

const initialState = {
  accessToken,
  user,
  isAuthenticated: !!accessToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      // Now we ensure action.payload.accessToken exists
      if (action.payload && action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        localStorage.setItem(
          'accessToken',
          JSON.stringify(action.payload.accessToken)
        );
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: state => {
      // Clear Redux state
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Clear cookies
      document.cookie =
        'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
      document.cookie =
        'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
      document.cookie =
        'connect.sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None';
      document.cookie =
        'sessionId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
    },
    refreshToken: (state, action) => {
      if (action.payload) {
        state.accessToken = action.payload;
        state.isAuthenticated = true;
      }
    },
  },
});

// Export actions
export const { login, logout, refreshToken, setUser } = authSlice.actions;

export const selectIsAuthenticated = state =>
  state.authSlice?.isAuthenticated || false;
export const selectCurrentUser = state => state.authSlice?.user || null;
export const selectAccessToken = state => state.authSlice?.accessToken || null;

export default authSlice.reducer;
