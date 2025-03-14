import React from 'react';
import { Box, Heading, VStack } from '@chakra-ui/react';
import LoginForm from '@/components/Auth/LoginForm';

const LoginPage = () => {
  return (
    <Box py={10} px={4} minH='100vh' display='flex' flexDirection='column'>
      <VStack spacing={8} mb={8}>
        <Heading as='h1' size='xl'>
          Login
        </Heading>
      </VStack>
      <LoginForm />
    </Box>
  );
};

export default LoginPage;
