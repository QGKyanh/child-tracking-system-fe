import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login, setUser } from '@/services/auth/authSlice';
import { Box, Center, Spinner, Text, useToast } from '@chakra-ui/react';
import { useGetUserInfoQuery } from '@/services/auth/authApi';

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  // Get token from URL query parameters
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  // Fetch user info once we have the token
  const {
    data: userData,
    isLoading,
    error: userError,
  } = useGetUserInfoQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Google Login Failed',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/login');
      return;
    }

    if (token) {
      // Store the token in Redux
      dispatch(login({ accessToken: token }));

      // If we have user data, store it too
      if (userData && !isLoading && !userError) {
        dispatch(setUser(userData));
        toast({
          title: 'Login Successful',
          description: `Welcome ${userData.name}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/');
      }
    } else if (!isLoading) {
      // If no token and not loading, redirect to login
      navigate('/login');
    }
  }, [token, error, userData, isLoading, userError, dispatch, navigate, toast]);

  return (
    <Center h='100vh'>
      <Box textAlign='center'>
        <Spinner size='xl' color='blue.500' mb={4} />
        <Text>Logging you in with Google...</Text>
      </Box>
    </Center>
  );
};

export default GoogleCallback;
