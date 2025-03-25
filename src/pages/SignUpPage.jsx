import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
  VStack,
  Heading,
} from '@chakra-ui/react';
import SignupForm from '@/components/Auth/SignupForm';
export default function SignUpPage() {
  return (
    <Box py={10} px={4} minH='100vh' display='flex' flexDirection='column'>
      <VStack spacing={8} mb={8}>
        <Heading as='h1' size='xl'>
          Register
        </Heading>
      </VStack>
      <SignupForm></SignupForm>
    </Box>
  );
}
