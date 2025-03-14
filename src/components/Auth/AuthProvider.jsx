import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserInfoQuery } from '@/services/auth/authApi';
import { selectAccessToken, setUser } from '@/services/auth/authSlice';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const accessToken = useSelector(selectAccessToken);

  // Only fetch user data if we have an access token
  const { data: userData, isLoading } = useGetUserInfoQuery(undefined, {
    skip: !accessToken, // Skip this query if no token is available
  });

  // Update Redux store when user data is fetched
  useEffect(() => {
    if (userData && !isLoading) {
      dispatch(setUser(userData));
    }
  }, [userData, isLoading, dispatch]);

  return children;
};

export default AuthProvider;
