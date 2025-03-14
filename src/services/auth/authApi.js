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
        url: '/auth/user',
        method: 'GET',
      }),
      transformResponse: res => res.data,
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserInfoQuery,
  useLoginWithGoogleMutation,
} = authApi;
