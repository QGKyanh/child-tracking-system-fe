import { apiSlice } from '@/api/apiSlice';

const commentsApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    createComment: build.mutation({
      query: data => ({
        url: '/comments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Comments'],
    }),
    getCommentById: build.query({
      query: id => ({
        url: `/comments/${id}`,
        method: 'GET',
      }),
      providesTags: ['Comments'],
    }),
    getCommentsByPost: build.query({
      query: ({ postId, page = 1, size = 10, search, order, sortBy }) => {
        const params = new URLSearchParams({ postId, page, size });
        if (search) params.append('search', search);
        if (order) params.append('order', order);
        if (sortBy) params.append('sortBy', sortBy);

        return {
          url: `/comments?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Comments'],
    }),
    updateComment: build.mutation({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body: { content },
      }),
      invalidatesTags: ['Comments'],
    }),
    deleteComment: build.mutation({
      query: id => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comments'],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentByIdQuery,
  useGetCommentsByPostQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
