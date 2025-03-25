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
import { useNavigate, useLocation } from 'react-router-dom';
import { useConfirmEmailMutation } from '@/services/auth/authApi';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  // Use useLocation to access query parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const verificationToken = searchParams.get('verificationToken');

  const [confirmEmail, { isLoading, isSuccess, error, data }] =
    useConfirmEmailMutation();

  useEffect(() => {
    if (verificationToken) {
      console.log('Verifying with token:', verificationToken);
      confirmEmail({ verificationToken })
        .unwrap()
        .catch(err => {
          console.error('Verification error:', err);
        });
    } else {
      console.log('No verification token found in URL');
    }
  }, [verificationToken, confirmEmail]);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (isLoading) {
    return (
      <Center minH='100vh' bg='gray.50'>
        <VStack spacing={4}>
          <Spinner size='xl' thickness='4px' color='teal.500' />
          <Text>Verifying your email...</Text>
        </VStack>
      </Center>
    );
  }

  if (isSuccess) {
    return (
      <Container maxW='container.md' py={12}>
        <VStack spacing={6} textAlign='center'>
          <Alert
            status='success'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            borderRadius='md'
            py={8}
          >
            <AlertIcon boxSize='40px' mr={0} />
            <AlertTitle mt={4} mb={1} fontSize='lg'>
              Email Verified!
            </AlertTitle>
            <AlertDescription maxW='sm'>
              {data?.message || 'Your email has been successfully verified.'}
            </AlertDescription>
          </Alert>
          <Button colorScheme='teal' onClick={handleLoginRedirect}>
            Go to Login
          </Button>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW='container.md' py={12}>
        <VStack spacing={6} textAlign='center'>
          <Alert
            status='error'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            borderRadius='md'
            py={8}
          >
            <AlertIcon boxSize='40px' mr={0} />
            <AlertTitle mt={4} mb={1} fontSize='lg'>
              Verification Failed
            </AlertTitle>
            <AlertDescription maxW='sm'>
              {error?.data?.message ||
                'There was an error verifying your email. Please try again or request a new verification link.'}
            </AlertDescription>
          </Alert>
          <Button
            colorScheme='teal'
            variant='outline'
            onClick={() => navigate('/resend-verification')}
          >
            Resend Verification Email
          </Button>
        </VStack>
      </Container>
    );
  }

  // If there's no token in the URL
  if (!verificationToken) {
    return (
      <Container maxW='container.md' py={12}>
        <VStack spacing={6} textAlign='center'>
          <Alert
            status='warning'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            borderRadius='md'
            py={8}
          >
            <AlertIcon boxSize='40px' mr={0} />
            <AlertTitle mt={4} mb={1} fontSize='lg'>
              Missing Verification Token
            </AlertTitle>
            <AlertDescription maxW='sm'>
              No verification token was found in the URL. Please use the
              complete verification link from your email.
            </AlertDescription>
          </Alert>
          <Button
            colorScheme='teal'
            variant='outline'
            onClick={() => navigate('/resend-verification')}
          >
            Request New Verification Link
          </Button>
          <Button variant='ghost' onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </VStack>
      </Container>
    );
  }

  // This should rarely be reached if the effect works properly
  return (
    <Center minH='90vh' bg='gray.50'>
      <VStack spacing={4}>
        <Spinner size='xl' thickness='4px' color='teal.500' />
        <Text>Processing verification request...</Text>
      </VStack>
    </Center>
  );
};

export default EmailVerificationPage;
