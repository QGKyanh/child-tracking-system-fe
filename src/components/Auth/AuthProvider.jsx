import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserInfoQuery } from '@/services/auth/authApi';
import {
  login,
  setUser,
  selectIsAuthenticated,
} from '@/services/auth/authSlice';
import { Box, Center, Spinner } from '@chakra-ui/react';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [initialCheckCompleted, setInitialCheckCompleted] = useState(false);

  // Always try to get user info on app start - this will check if there are valid cookies
  const {
    data: userData,
    isLoading,
    isSuccess,
    isError,
  } = useGetUserInfoQuery();

  // Update Redux store when user data is fetched
  useEffect(() => {
    // Once we've attempted to fetch user data, mark initial check as complete
    if (!isLoading) {
      setInitialCheckCompleted(true);
    }

    if (userData && isSuccess) {
      // If we got user data successfully, update Redux state
      if (!isAuthenticated) {
        dispatch(login({ accessToken: 'cookie-based-auth' }));
      }
      dispatch(setUser(userData));
    }
  }, [userData, isLoading, isSuccess, isAuthenticated, dispatch]);

  // Show loading state only during initial auth check
  if (!initialCheckCompleted) {
    return (
      <Center height='100vh'>
        <Spinner size='xl' color='blue.500' />
      </Center>
    );
  }

  return children;
};

export default AuthProvider;
