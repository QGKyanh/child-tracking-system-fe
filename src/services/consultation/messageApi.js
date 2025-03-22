import { apiSlice } from '@/api/apiSlice';

const messageApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    createMessage: build.mutation({
      query: data => ({
        url: '/consultations-messages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Messages'],
    }),
    getListMessageByConsultationId: build.query({
      query: id => ({
        url: `/consultations-messages/consultations/${id}`,
        method: 'GET',
      }),
      providesTags: ['Messages'],
    }),
  }),
});

export const {
  useCreateMessageMutation,
  useGetListMessageByConsultationIdQuery,
} = messageApi;
