import { apiSlice } from '@/api/apiSlice';

const childApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    getListChildren: build.query({
      query: () => ({
        url: '/children',
        method: 'GET',
      }),
      transformResponse: res => res,
      providesTags: ['Child'],
    }),
    getChildById: build.query({
      query: id => ({
        url: `/children/${id}`,
        method: 'GET',
      }),
      transformResponse: res => res.data || res,
      providesTags: ['Child'],
    }),
    updateChild: build.mutation({
      query: data => ({
        url: `/children/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Child'],
    }),
    createChild: build.mutation({
      query: data => ({
        url: '/children',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Child'],
    }),
    deleteChild: build.mutation({
      query: id => ({
        url: `/children/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Child'],
    }),
  }),
});

export const {
  useGetListChildrenQuery,
  useGetChildByIdQuery,
  useUpdateChildMutation,
  useCreateChildMutation,
  useDeleteChildMutation,
} = childApi;
