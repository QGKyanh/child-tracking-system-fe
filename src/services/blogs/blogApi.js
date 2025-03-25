import { apiSlice } from '@/api/apiSlice';

const blogApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    getListBlogs: build.query({
      query: ({
        page = 1,
        size = 5,
        order = '',
        sortBy = '',
        search = '',
      } = {}) => ({
        url: `/posts?page=${page}&size=${size}&search=${search}&order=${order}&sortBy=${sortBy}`,
        method: 'GET',
      }),
      transformResponse: res => res,
      providesTags: ['Blog'],
    }),
    getBlogById: build.query({
      query: id => ({
        url: `/posts/${id}`,
        method: 'GET',
      }),
      transformResponse: res => res,
      providesTags: ['Blog'],
    }),
    createBlog: build.mutation({
      query: formData => ({
        url: '/posts',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: build.mutation({
      query: ({ id, formData }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: build.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetListBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
