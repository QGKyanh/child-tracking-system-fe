import { apiSlice } from '@/api/apiSlice';

const userApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    getListUser: build.query({
      // GetRetrieves a list of users with optional pagination and filters.
      //Admins & doctors can view other members & doctors. Member can only view doctors.
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      transformResponse: res => res,
      providesTags: ['User'],
    }),
    /*Retrieves user details based on user ID.
      Admins & doctors can view other members & doctors.
      Member can only view doctors. */
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
        method: 'PATCH',
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
