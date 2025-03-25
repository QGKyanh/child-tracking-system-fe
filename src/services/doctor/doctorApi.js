import { apiSlice } from '@/api/apiSlice';

const doctorApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    // 🟢 Lấy danh sách requests của bác sĩ theo ID và tham số phân trang, sắp xếp
    getDoctorRequests: build.query({
      query: ({
        doctorId,
        page = 1,
        size = 10, // Đảm bảo mỗi trang có 10 yêu cầu
        order = 'ascending',
        sortBy = 'date',
        as = 'DOCTOR',
      }) => ({
        url: `/requests/users/${doctorId}`,
        method: 'GET',
        params: new URLSearchParams({
          page,    // Truyền số trang cần lấy
          size,    // Số lượng yêu cầu mỗi trang
          order,
          sortBy,
          as,
        }).toString(),
      }),
      transformResponse: res => {
        // Dữ liệu từ backend có thể trả về là { requests: { requests: [...] }, totalPages: X }
        return {
          requests: res?.requests?.requests || [],
          totalPages: res?.totalPages || 1,  // Đảm bảo lấy đúng số trang tổng cộng
        };
      },
      providesTags: ['Request'],
    }),
    

    // 🟢 Cập nhật trạng thái request
    updateRequestStatus: build.mutation({
      query: data => ({
        url: `/requests/status/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Request'],
    }),

    // 🟢 Lấy chi tiết một request theo request ID
    getRequestById: build.query({
      query: id => ({
        url: `/requests/${id}`,
        method: 'GET',
      }),
      transformResponse: res => res.data || res,
      providesTags: ['Request'],
    }),

    // 🟢 Lấy dữ liệu tăng trưởng của trẻ
    getChildGrowthData: build.query({
      query: childId => ({
        url: `/children/${childId}/growth-data`,
        method: 'GET',
      }),
      transformResponse: res => res.data || res,
      providesTags: ['Child'],
    }),
  }),
});

export const {
  useGetDoctorRequestsQuery,
  useUpdateRequestStatusMutation,
  useGetRequestByIdQuery,
  useGetChildGrowthDataQuery,
} = doctorApi;
