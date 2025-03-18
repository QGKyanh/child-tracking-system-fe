import { Button, Icon, Text } from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Get the API endpoint from environment variables
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || '';

    // Redirect to the Google OAuth endpoint
    window.location.href = `${apiEndpoint}/api/auth/google`;
  };

  return (
    <Button
      w='full'
      variant='outline'
      leftIcon={<Icon as={FaGoogle} color='red.500' />}
      onClick={handleGoogleLogin}
    >
      <Text>Continue with Google</Text>
    </Button>
  );
};

export default GoogleLoginButton;
