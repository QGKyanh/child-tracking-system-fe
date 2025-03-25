import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  VStack,
  Button,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import DoctorCard from '@/components/Doctor/DoctorCard';
import { useGetListUserQuery } from '@/services/user/userApi';
import { useGetListChildrenQuery } from '@/services/child/childApi';

const ListDoctorPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(null); // null (no sort), 'asc', or 'desc'

  const {
    data: doctorsResponse,
    isLoading: isLoadingDoctors,
    error: doctorsError,
  } = useGetListUserQuery();

  const {
    data: childrenResponse,
    isLoading: isLoadingChildren,
    error: childrenError,
  } = useGetListChildrenQuery();

  const doctors = doctorsResponse?.users || [];

  const children = childrenResponse?.children || [];

  const filteredDoctors = doctors
    .filter(
      doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortOrder) return 0; // No sorting if sortOrder is null
      const ratingA = a.rating || 0; // Default to 0 if rating is missing
      const ratingB = b.rating || 0; // Default to 0 if rating is missing
      return sortOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA;
    });

  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };

  const handleSort = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc')); // Toggle between asc and desc
  };

  if (isLoadingDoctors || isLoadingChildren) {
    return (
      <Center p={10} h='50vh'>
        <Spinner size='xl' thickness='4px' color='blue.500' />
      </Center>
    );
  }

  if (doctorsError || childrenError) {
    return (
      <Alert status='error' variant='solid' borderRadius='md'>
        <AlertIcon />
        <AlertTitle mr={2}>Error!</AlertTitle>
        <AlertDescription>
          Failed to load data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Container maxW='container.xl' py={8}>
      <VStack spacing={6} align='stretch'>
        <Box>
          <Heading as='h1' size='xl' mb={4}>
            Find a Doctor
          </Heading>
          <Box display='flex' alignItems='center' gap={4}>
            <InputGroup maxW='500px'>
              <InputLeftElement pointerEvents='none'>
                <SearchIcon color='gray.300' />
              </InputLeftElement>
              <Input
                type='text'
                placeholder='Search doctors by name or email'
                value={searchTerm}
                onChange={handleSearch}
                borderRadius='md'
              />
            </InputGroup>
            <Button
              colorScheme='teal'
              variant='outline'
              onClick={handleSort}
            >
              Sort by Rating {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : ''}
            </Button>
          </Box>
        </Box>

        {filteredDoctors.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {filteredDoctors.map(doctor => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                children={children}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Center p={10} bg='gray.50' borderRadius='md'>
            <Text>No doctors found</Text>
          </Center>
        )}
      </VStack>
    </Container>
  );
};

export default ListDoctorPage;