import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Divider,
  Badge,
  Avatar,
  Flex,
  SimpleGrid,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetChildByIdQuery } from '@/services/child/childApi';

const ChildDetail = () => {
  const { childId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useGetChildByIdQuery(childId);
  const child = data?.child;

  const calculateAge = (birthDate) => {
    try {
      const today = new Date();
      const birth = new Date(birthDate);

      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();

      if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
        years--;
        months += 12;
      }

      if (years === 0) return `${months} months`;
      return `${years} years, ${months} months`;
    } catch {
      return 'Unknown age';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return 'Unknown date';
    }
  };

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size='xl' color='blue.500' />
      </Center>
    );
  }

  if (isError || !child) {
    return (
      <Center py={10}>
        <Alert status='error'>
          <AlertIcon />
          {error?.data?.message || 'Failed to load child data'}
        </Alert>
      </Center>
    );
  }

  return (
    <Box maxW='3xl' mx='auto' p={6}>
      <Flex justify='space-between' align='center' mb={6}>
        <Heading>Child Detail</Heading>
        <Button onClick={() => navigate(-1)} colorScheme='blue'>
          Go Back
        </Button>
      </Flex>

      <VStack align='stretch' spacing={6}>
        <Flex align='center'>
          <Avatar
            size='xl'
            name={child.name}
            bg={child.gender === 0 ? 'blue.400' : 'pink.400'}
            color='white'
            mr={6}
          />
          <Box>
            <Heading size='lg'>{child.name}</Heading>
            <Badge colorScheme={child.gender === 0 ? 'blue' : 'pink'} mt={1}>
              {child.gender === 0 ? 'Boy' : 'Girl'}
            </Badge>
            <Text mt={2} fontSize='lg' color='gray.600'>
              {calculateAge(child.birthDate)}
            </Text>
          </Box>
        </Flex>

        <Divider />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box>
            <Text fontWeight='bold' fontSize='sm' color='gray.500'>
              Birth Date
            </Text>
            <Text>{formatDate(child.birthDate)}</Text>
          </Box>

          <Box>
            <Text fontWeight='bold' fontSize='sm' color='gray.500'>
              Relationship
            </Text>
            <Text>{child.relationships?.[0]?.type || 'Parent'}</Text>
          </Box>

          {child.feedingType && (
            <Box>
              <Text fontWeight='bold' fontSize='sm' color='gray.500'>
                Feeding Type
              </Text>
              <Text>{child.feedingType}</Text>
            </Box>
          )}

          {child.allergies && (
            <Box>
              <Text fontWeight='bold' fontSize='sm' color='gray.500'>
                Allergies
              </Text>
              <Text>{Array.isArray(child.allergies) ? child.allergies.join(', ') : child.allergies}</Text>
            </Box>
          )}
        </SimpleGrid>

        {child.note && (
          <Box>
            <Divider mb={2} />
            <Text fontWeight='bold' fontSize='sm' color='gray.500'>
              Notes
            </Text>
            <Text whiteSpace='pre-wrap'>{child.note}</Text>
          </Box>
        )}

        <Box>
          <Divider mb={2} />
          <Text fontWeight='bold' fontSize='sm' color='gray.500'>
            Added On
          </Text>
          <Text>{formatDate(child.createdAt)}</Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default ChildDetail;
