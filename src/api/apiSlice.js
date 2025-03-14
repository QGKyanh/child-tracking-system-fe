import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';

// Create a mutex for token refreshing
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_ENDPOINT + '/api',
  credentials: 'include', // Send cookies with every request
  prepareHeaders: (headers, { getState }) => {
    // Get the token from auth state if available
    const token = getState().auth?.accessToken;

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

        if (refreshResult.data) {
          // Store the new token
          api.dispatch({
            type: 'authSlice/setCredentials',
            payload: { accessToken: refreshResult.data.accessToken },
          });

          // Retry the original request
          result = await baseQuery(args, api, extraOptions);
        } else {
          // If refresh fails, log out
          api.dispatch({ type: 'authSlice/logout' });
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
  tagTypes: ['Auth'],
  endpoints: () => ({}),
});
