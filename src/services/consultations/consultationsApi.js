import { apiSlice } from '@/api/apiSlice';

// services/consultations/consultationsApi.js
export const consultationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConsultationsByUserId: builder.query({
      query: ({ userId, page = 1, size = 10, search = '', order = 'ascending', sortBy = '', status = '', as = 'DOCTOR' }) => {
        const params = new URLSearchParams();

        if (page) params.append('page', page);
        if (size) params.append('size', size);
        if (search) params.append('search', search);
        if (order) params.append('order', order);
        if (sortBy) params.append('sortBy', sortBy);
        if (status) params.append('status', status);
        if (as) params.append('as', as); // 👈 lấy từ component truyền xuống

        return {
          url: `/consultations/users/${userId}?${params.toString()}`, 
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useGetConsultationsByUserIdQuery,
} = consultationApi;
