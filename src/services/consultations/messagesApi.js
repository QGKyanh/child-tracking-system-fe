import { apiSlice } from '@/api/apiSlice';

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesByConsultationId: builder.query({
      query: ({ consultationId, page = 1, size = 100 }) => 
        `/consultation-messages/consultations/${consultationId}?page=${page}&size=${size}`, // Thêm tham số vào URL
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
