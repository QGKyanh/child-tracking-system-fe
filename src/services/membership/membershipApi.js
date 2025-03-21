import { apiSlice } from '@/api/apiSlice';

const membershipApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    getListMembershipPackages: build.query({
      query: ({ page = 1, size = 3 }) => ({
        url: `/membership-packages?page=${page}&size=${size}`,
        method: 'GET',
      }),
      transformResponse: res => res,
      providesTags: ['Membership'],
    }),
    getMembershipPackageById: build.query({
      query: ({ id }) => ({
        url: `/membership-packages/${id}`,
        method: 'GET',
      }),
      transformResponse: res => res,
      providesTags: ['Membership'],
    }),
  }),
});

export const {
  useGetListMembershipPackagesQuery,
  useGetMembershipPackageByIdQuery,
} = membershipApi;
