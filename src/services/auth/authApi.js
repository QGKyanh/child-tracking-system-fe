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
      queryFn: () => {
        // Redirect to Google auth endpoint
        window.location.href = `${import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000'}/api/auth/google`;
        return { data: null }; // Return a placeholder since we're redirecting
      },
      invalidatesTags: ['Auth'],
    }),
    register: build.mutation({
      query: data => ({
        url: '/auth/signup',
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
    changePassword: build.mutation({
      query: data => ({
        url: '/auth/change-password',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
    confirmEmail: build.mutation({
      query: data => ({
        url: '/auth/confirm-email-verification-token',
        method: 'POST',
        body: data,
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
  useChangePasswordMutation,
  useConfirmEmailMutation,
} = authApi;
