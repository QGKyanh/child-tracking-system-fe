import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Image,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
  // Use the same blue from your navbar for consistency
  const primaryColor = '#3498DB';

  return (
    <Container maxW='container.xl' centerContent py={20}>
      <VStack spacing={8} textAlign='center'>
        <Image
          src='https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569_960_720.jpg'
          alt='404 illustration'
          boxSize={{ base: '200px', md: '300px' }}
          objectFit='contain'
          borderRadius='full'
          boxShadow='lg'
        />

        <Heading
          as='h1'
          size='2xl'
          bgGradient={`linear(to-r, ${primaryColor}, #2980B9)`}
          backgroundClip='text'
          fontWeight='extrabold'
        >
          404
        </Heading>

        <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight='bold'>
          Page Not Found
        </Text>

        <Text color={useColorModeValue('gray.600', 'gray.400')} maxW='md'>
          Oops! It looks like the page you're looking for doesn't exist. It
          might have been moved or deleted.
        </Text>

        <Box pt={4}>
          <Button
            as={RouterLink}
            to='/'
            bg={primaryColor}
            color='white'
            _hover={{
              bg: '#2980B9',
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            size='lg'
            transition='all 0.3s ease'
          >
            Return to Home
          </Button>
        </Box>
      </VStack>

      <Box
        position='absolute'
        bottom={0}
        left={0}
        right={0}
        height='200px'
        bgGradient={`linear(to-t, ${useColorModeValue(
          '#f7fafc20',
          '#2D3748'
        )}, transparent)`}
        zIndex='-1'
        pointerEvents='none'
      />
    </Container>
  );
};

export default NotFound;
