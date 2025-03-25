import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  Button,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConfirmEmailMutation } from '@/services/auth/authApi'; 

const EmailVerificationPage = () => {
  const { verificationToken } = useParams(); 
  const navigate = useNavigate(); 
  const [confirmEmail, { isLoading, isSuccess, error, data }] = useConfirmEmailMutation();

  useEffect(() => {
    if (verificationToken) {
      confirmEmail({ verificationToken }) 
        .unwrap()
        .catch(() => {}); 
    }
  }, [verificationToken, confirmEmail]);


  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (isLoading) {
    return (
      <Center minH="100vh" bg="gray.50">
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" color="teal.500" />
          <Text>Verifying your email...</Text>
        </VStack>
      </Center>
    );
  }

  if (isSuccess) {
    return (
      <Container maxW="container.md" py={12}>
        <VStack spacing={6} textAlign="center">
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="md"
            py={8}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Email Verified!
            </AlertTitle>
            <AlertDescription maxW="sm">
              {data?.message || 'Your email has been successfully verified.'}
            </AlertDescription>
          </Alert>
          <Button colorScheme="teal" onClick={handleLoginRedirect}>
            Go to Login
          </Button>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={12}>
        <VStack spacing={6} textAlign="center">
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="md"
            py={8}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Verification Failed
            </AlertTitle>
            <AlertDescription maxW="sm">
              {error?.data?.message || 'There was an error verifying your email. Please try again or request a new verification link.'}
            </AlertDescription>
          </Alert>
          <Button colorScheme="teal" variant="outline" onClick={() => navigate('/resend-verification')}>
            Resend Verification Email
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Center minH="90vh" bg="gray.50">
      <Text>No verification token provided.</Text>
    </Center>
  );
};

export default EmailVerificationPage;