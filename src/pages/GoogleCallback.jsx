import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login, setUser } from '@/services/auth/authSlice';
import {
  Box,
  Center,
  Spinner,
  Text,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useGetUserInfoQuery } from '@/services/auth/authApi';

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  // Check if there's an error in the URL
  const error = searchParams.get('error');

  // Directly fetch user info since we now have cookies from the Google auth redirect
  const {
    data: userData,
    isLoading: isLoadingUserData,
    isError,
    error: userInfoError,
  } = useGetUserInfoQuery();

  useEffect(() => {
    console.log('Google callback mounted, checking cookies...');

    // Handle error from URL parameter
    if (error) {
      console.error('Google auth error:', error);
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

    // Handle user data loading error
    if (isError) {
      console.error('User data error:', userInfoError);
      toast({
        title: 'Login Failed',
        description:
          userInfoError?.data?.message || 'Could not retrieve user information',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/login');
      return;
    }

    // If we have user data, we're logged in successfully
    if (userData && !isLoadingUserData) {
      console.log('User data received:', userData);

      // Tell Redux we're authenticated
      dispatch(login({ accessToken: 'cookie-based-auth' }));
      dispatch(setUser(userData));

      toast({
        title: 'Login Successful',
        description: `Welcome ${userData.name || ''}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      navigate('/');
    }
  }, [
    userData,
    isLoadingUserData,
    isError,
    userInfoError,
    error,
    dispatch,
    navigate,
    toast,
  ]);

  return (
    <Center h='100vh' flexDirection='column'>
      {error ? (
        <Alert status='error' variant='solid' maxW='md'>
          <AlertIcon />
          Authentication failed: {error}
        </Alert>
      ) : (
        <Box textAlign='center'>
          <Spinner size='xl' color='blue.500' mb={4} thickness='4px' />
          <Text fontSize='lg' fontWeight='medium'>
            Logging you in with Google...
          </Text>
          <Text color='gray.500' mt={2}>
            Please wait while we complete the authentication process.
          </Text>
        </Box>
      )}
    </Center>
  );
};

export default GoogleCallback;
