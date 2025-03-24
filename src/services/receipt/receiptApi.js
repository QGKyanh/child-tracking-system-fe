import { apiSlice } from "@/api/apiSlice";

const receiptApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getReceiptsByUserId: build.query({
      query: ({ userId, page = 1, size = 10, sortBy = 'date', order = 'descending' }) => ({
        url: `/receipts/users/${userId}`,
        method: 'GET',
        params: { page, size, sortBy, order },
      }),
      providesTags: ['Receipt'],
    }),
  }),
});

export const { useGetReceiptsByUserIdQuery } = receiptApi;
