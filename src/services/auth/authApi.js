import { apiSlice } from '@/api/apiSlice';

const authApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    login: build.mutation({
      query: data => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    loginWithGoogle: build.mutation({
      query: () => ({
        url: '/auth/google',
        method: 'GET',
      }),
      transformResponse: res => res.data,
      invalidatesTags: ['Auth'],
    }),
    register: build.mutation({
      query: data => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
      transformResponse: res => res.data,
      invalidatesTags: ['Auth'],
    }),
    getUserInfo: build.query({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      transformResponse: res => res.user,
      providesTags: ['Auth'],
    }),
    logout: build.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserInfoQuery,
  useLoginWithGoogleMutation,
  useLogoutMutation,
} = authApi;
