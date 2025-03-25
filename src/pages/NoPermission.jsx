import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Center,
  VStack,
  Icon,
  Container,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NoPermission = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box bg={bgColor} minH='100vh' py={10}>
      <Container maxW='container.md'>
        <Center>
          <Box
            bg={cardBgColor}
            p={8}
            borderRadius='lg'
            boxShadow='md'
            textAlign='center'
            width='100%'
          >
            <VStack spacing={6}>
              <Flex
                bg='red.100'
                color='red.500'
                rounded='full'
                width='80px'
                height='80px'
                justify='center'
                align='center'
              >
                <Icon as={FaLock} boxSize={10} />
              </Flex>

              <Heading size='xl' color='red.500'>
                Access Denied
              </Heading>

              <Text fontSize='lg' color='gray.600'>
                Sorry, you don't have permission to access this page.
              </Text>

              <Text color='gray.500' pb={2}>
                This area might require different permissions or a higher
                membership level. If you believe this is an error, please
                contact support.
              </Text>

              <Box pt={4}>
                <Button
                  colorScheme='blue'
                  size='lg'
                  mr={4}
                  onClick={() => navigate('/')}
                >
                  Go to Home
                </Button>

                <Button
                  variant='outline'
                  colorScheme='blue'
                  size='lg'
                  onClick={() => navigate('/plans')}
                >
                  View Plans
                </Button>
              </Box>
            </VStack>
          </Box>
        </Center>
      </Container>
    </Box>
  );
};

export default NoPermission;
