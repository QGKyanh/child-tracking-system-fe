import { apiSlice } from '@/api/apiSlice';

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesByConsultationId: builder.query({
      query: (consultationId) => `/consultation-messages/consultations/${consultationId}`,
      providesTags: (result, error, id) => [{ type: 'Messages', id }],
      transformResponse: (response) => response.consultationMessages,
    }),

    // Thêm endpoint gửi message
    createMessage: builder.mutation({
      query: (formData) => ({
        url: '/consultation-messages',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Messages', id: arg.get('consultationId') }],
    }),
  }),
});

export const {
  useGetMessagesByConsultationIdQuery,
  useCreateMessageMutation,
} = messagesApi;
