import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '@/services/auth/authSlice'; // Không cần refreshToken action nữa
import { Mutex } from 'async-mutex';

const mutex = new Mutex();
const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4000";

// Bỏ prepareHeaders vì token đã được gửi qua cookies
const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api`,
  credentials: 'include', // Quan trọng: Gửi/nhận cookies tự động
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // Gọi renew-access-token (token mới sẽ được set vào cookies)
        const refreshResult = await baseQuery(
          { url: '/auth/renew-access-token', method: 'POST' },
          api,
          extraOptions
        );

        if (!refreshResult.error) {
          // Retry request gốc với cookie mới
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Nếu refresh thất bại, logout
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      // Đợi mutex unlock và thử lại
      await mutex.waitForUnlock();
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