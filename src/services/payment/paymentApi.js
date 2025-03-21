import { apiSlice } from '@/api/apiSlice';

const paymentApi = apiSlice.injectEndpoints({
  endpoints: build => ({
    createVNPayPayment: build.mutation({
      query: data => ({
        url: '/payments/vnpay/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payments'],
    }),
    createPayPalPayment: build.mutation({
      query: data => ({
        url: '/payments/paypal/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payments'],
    }),
  }),
});

export const { useCreateVNPayPaymentMutation, useCreatePayPalPaymentMutation } =
  paymentApi;
