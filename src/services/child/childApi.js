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
    getGrowthData: build.query({
      query: id => ({
        url: `/children/${id}/growth-data`,
        method: 'GET',
      }),
      transformResponse: res => res.data || res,
      providesTags: ['Child'],
    }),
    createGrowthData: build.mutation({
      query: data => ({
        url: `/children/${data.childId}/growth-data`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Child'],
    }),
    updateGrowthData: build.mutation({
      query: data => ({
        url: `/children/${data.childId}/growth-data/${data._id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Child'],
    }),
    deleteGrowthData: build.mutation({
      query: data => ({
        url: `/children/${data.childId}/growth-data/${data._id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Child'],
    }),
    getGrowthDataById: build.query({
      query: data => ({
        url: `/children/${data.childId}/growth-data/${data._id}`,
        method: 'GET',
      }),
      transformResponse: res => res.data || res,
      providesTags: ['Child'],
    }),
    getGrowthVelocity: build.query({
      query: id => ({
        url: `/children/${id}/growth-velocity`,
        method: 'GET',
      }),
      transformResponse: res => res.data || res,
      providesTags: ['Child'],
    }),
  }),
});

export const {
  useGetListChildrenQuery,
  useGetChildByIdQuery,
  useUpdateChildMutation,
  useCreateChildMutation,
  useDeleteChildMutation,
  useGetGrowthDataQuery,
  useCreateGrowthDataMutation,
  useUpdateGrowthDataMutation,
  useDeleteGrowthDataMutation,
  useGetGrowthDataByIdQuery,
  useGetGrowthVelocityQuery,
} = childApi;
