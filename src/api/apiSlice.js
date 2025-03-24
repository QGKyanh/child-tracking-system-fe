import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, refreshToken } from '@/services/auth/authSlice';
import { Mutex } from 'async-mutex';

// Create a mutex for token refreshing
const mutex = new Mutex();
const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4000";
console.log("API BASE URL:", API_BASE_URL);

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api`,
  credentials: 'include', // Send cookies with every request
  prepareHeaders: (headers, { getState }) => {
    // Get the token from auth state if available
    const token = getState().authSlice?.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Create a custom base query with error handling and token refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Check if mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        // Try to refresh the token
        const refreshResult = await baseQuery(
          {
            url: '/auth/renew-access-token',
            method: 'POST',
          },
          api,
          extraOptions
        );

        // Check if we got a new access token
        if (refreshResult.data && refreshResult.data.accessToken) {
          // Store the new token in Redux
          api.dispatch(refreshToken(refreshResult.data.accessToken));

          // Retry the original request
          result = await baseQuery(args, api, extraOptions);
        } else {
          // If refresh fails, log out
          api.dispatch(logout());
        }
      } finally {
        // Release the mutex
        release();
      }
    } else {
      // Wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Child'],
  endpoints: () => ({}),
});