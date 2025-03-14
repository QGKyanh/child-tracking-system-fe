import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@/services/auth/authSlice';
import { apiSlice } from '@/api/apiSlice';

const rootReducer = {
  authSlice,
};
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,

    ...rootReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
