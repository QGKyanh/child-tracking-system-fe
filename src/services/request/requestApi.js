import { apiSlice } from '@/api/apiSlice';

const requestApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    updateRequestStatus: build.mutation({
      query: id => ({
        url: `/requests/status/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Requests'],
    }),
    createRequest: build.mutation({
      query: data => ({
        url: '/requests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Requests'],
    }),
    deleteRequest: build.mutation({
      query: id => ({
        url: `/requests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Requests'],
    }),
    getListRequestById: build.query({
      query: id => ({
        url: `/requests/users/${id}`,
        method: 'GET',
      }),
      providesTags: ['Requests'],
    }),
    getDetailRequestById: build.query({
      query: id => ({
        url: `/requests/${id}`,
        method: 'GET',
      }),
      providesTags: ['Requests'],
    }),
  }),
});

export const {
  useUpdateRequestStatusMutation,
  useCreateRequestMutation,
  useDeleteRequestMutation,
  useGetListRequestByIdQuery,
  useGetDetailRequestByIdQuery,
} = requestApi;
