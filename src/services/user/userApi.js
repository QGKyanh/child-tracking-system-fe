import { apiSlice } from '@/api/apiSlice';

const userApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    getListUser: build.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      transformResponse: res => res.data,
      providesTags: ['User'],
    }),
    getUserById: build.query({
      query: id => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      transformResponse: res => res.data,
      providesTags: ['User'],
    }),
    updateUser: build.mutation({
      query: data => ({
        url: '/users',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetListUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} = userApi;
