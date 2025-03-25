import { apiSlice } from '@/api/apiSlice';

const consultationApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    // Updates the status of a consultation. Only members and admins can perform this action.
    updateConsultationStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/consultations/status/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Consultations'],
    }),
    getListConsultationById: build.query({
      // User & Doctor can get theirs own consultation
      query: id => ({
        url: `/consultations/users/${id}`,
        method: 'GET',
      }),
      providesTags: ['Consultations'],
    }),
    getDetailConsultationById: build.query({
      // User & Doctor can get theirs own consultation
      query: id => ({
        url: `/consultations/${id}`,
        method: 'GET',
      }),
      providesTags: ['Consultations'],
    }),
    deleteConsultation: build.mutation({
      // Only members and admins can delete a consultation
      query: id => ({
        url: `/consultations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Consultations'],
    }),
    // Create a consultation rating
    createConsultationRating: build.mutation({
      query: ({ id, rating }) => ({
        url: `/users/consultation/${id}/rating`,
        method: 'POST',
        body: { rating },
      }),
      invalidatesTags: ['Consultations'],
    }),

    // Update a consultation rating
    updateConsultationRating: build.mutation({
      query: ({ id, rating }) => ({
        url: `/users/consultation/${id}/rating`,
        method: 'PUT',
        body: { rating },
      }),
      invalidatesTags: ['Consultations'],
    }),

    // Remove a consultation rating
    deleteConsultationRating: build.mutation({
      query: id => ({
        url: `/users/consultation/${id}/rating`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Consultations'],
    }),
  }),
});

export const {
  useUpdateConsultationStatusMutation,
  useGetListConsultationByIdQuery,
  useGetDetailConsultationByIdQuery,
  useDeleteConsultationMutation,
  useCreateConsultationRatingMutation,
  useUpdateConsultationRatingMutation,
  useDeleteConsultationRatingMutation,
} = consultationApi;
