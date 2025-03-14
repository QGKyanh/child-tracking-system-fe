import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/services/auth/authSlice';
import { useLogoutMutation } from '@/services/auth/authApi';
import { Box, Spinner, Center } from '@chakra-ui/react';

const LogoutHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Call the logout API endpoint
        await logoutApi().unwrap();
      } catch (err) {
        console.error('Logout API error:', err);
      } finally {
        // Always dispatch logout action to clear local state
        dispatch(logout());
        // Redirect to login page
        navigate('/');
      }
    };

    performLogout();
  }, [dispatch, navigate, logoutApi]);

  return (
    <Center h='100vh'>
      <Box textAlign='center'>
        <Spinner size='xl' mb={4} color='blue.500' />
        <Box>Logging out...</Box>
      </Box>
    </Center>
  );
};

export default LogoutHandler;
