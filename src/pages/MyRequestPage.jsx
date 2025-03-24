import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Badge,
  Flex,
  Select,
  HStack,
  Button,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useGetListRequestByIdQuery } from '@/services/request/requestApi';
import RequestCard from '@/components/Request/RequestCard';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/services/auth/authSlice';

const MyRequestPage = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Use the selector from authSlice to get the current user
  const user = useSelector(selectCurrentUser);

  const {
    data: requestsData,
    isLoading,
    error,
    refetch,
  } = useGetListRequestByIdQuery(user?._id, {
    // Skip the query if user ID is not available
    skip: !user?._id,
  });

  const columnCount = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  // When user ID changes, refetch the requests
  useEffect(() => {
    if (user?._id) {
      refetch();
    }
  }, [user, refetch]);

  // Filter and sort the requests
  const getFilteredRequests = () => {
    if (!requestsData?.requests?.requests) return [];

    let filtered = [...requestsData.requests.requests];

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Sort requests
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  // Count requests by status
  const countByStatus = {
    All: filteredRequests.length,
    Pending: filteredRequests.filter(r => r.status === 'Pending').length,
    Accepted: filteredRequests.filter(r => r.status === 'Accepted').length,
    Rejected: filteredRequests.filter(r => r.status === 'Rejected').length,
  };

  if (isLoading) {
    return (
      <Center h='50vh'>
        <Spinner size='xl' thickness='4px' color='blue.500' />
      </Center>
    );
  }

  if (error) {
    return (
      <Container maxW='container.xl' py={8}>
        <Alert status='error' borderRadius='md'>
          <AlertIcon />
          Failed to load requests. Please try again later.
        </Alert>
      </Container>
    );
  }

  // Show message if user is not logged in
  if (!user) {
    return (
      <Container maxW='container.xl' py={8}>
        <Alert status='warning' borderRadius='md'>
          <AlertIcon />
          Please log in to view your consultation requests.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW='container.xl' py={8}>
      <Box mb={8}>
        <Heading as='h1' mb={2}>
          My Consultation Requests
        </Heading>
        <Text color='gray.600'>
          Track and manage your consultation requests with doctors
        </Text>
      </Box>

      <Tabs
        colorScheme='blue'
        mb={6}
        onChange={index => {
          // Update status filter based on tab index
          const statuses = ['All', 'Pending', 'Accepted', 'Rejected'];
          setStatusFilter(statuses[index]);
        }}
      >
        <TabList>
          <Tab _selected={{ color: 'blue.500', borderColor: 'blue.500' }}>
            All
            <Badge ml={2} colorScheme='blue' borderRadius='full'>
              {countByStatus.All}
            </Badge>
          </Tab>
          <Tab _selected={{ color: 'yellow.500', borderColor: 'yellow.500' }}>
            Pending
            <Badge ml={2} colorScheme='yellow' borderRadius='full'>
              {countByStatus.Pending}
            </Badge>
          </Tab>
          <Tab _selected={{ color: 'green.500', borderColor: 'green.500' }}>
            Accepted
            <Badge ml={2} colorScheme='green' borderRadius='full'>
              {countByStatus.Accepted}
            </Badge>
          </Tab>
          <Tab _selected={{ color: 'red.500', borderColor: 'red.500' }}>
            Rejected
            <Badge ml={2} colorScheme='red' borderRadius='full'>
              {countByStatus.Rejected}
            </Badge>
          </Tab>
        </TabList>

        <HStack justifyContent='flex-end' mt={4} mb={2}>
          <Text fontSize='sm'>Sort by:</Text>
          <Select
            size='sm'
            width='150px'
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value='newest'>Newest first</option>
            <option value='oldest'>Oldest first</option>
          </Select>
        </HStack>

        <TabPanels>
          {/* All Requests Tab */}
          <TabPanel px={0}>
            {filteredRequests.length > 0 ? (
              <SimpleGrid columns={columnCount} spacing={4}>
                {filteredRequests.map(request => (
                  <RequestCard key={request._id} request={request} />
                ))}
              </SimpleGrid>
            ) : (
              <Center py={10}>
                <Text>No requests found</Text>
              </Center>
            )}
          </TabPanel>

          {/* Pending Requests Tab */}
          <TabPanel px={0}>
            {filteredRequests.filter(r => r.status === 'Pending').length > 0 ? (
              <SimpleGrid columns={columnCount} spacing={4}>
                {filteredRequests
                  .filter(r => r.status === 'Pending')
                  .map(request => (
                    <RequestCard key={request._id} request={request} />
                  ))}
              </SimpleGrid>
            ) : (
              <Center py={10}>
                <Text>No pending requests</Text>
              </Center>
            )}
          </TabPanel>

          {/* Accepted Requests Tab */}
          <TabPanel px={0}>
            {filteredRequests.filter(r => r.status === 'Accepted').length >
            0 ? (
              <SimpleGrid columns={columnCount} spacing={4}>
                {filteredRequests
                  .filter(r => r.status === 'Accepted')
                  .map(request => (
                    <RequestCard key={request._id} request={request} />
                  ))}
              </SimpleGrid>
            ) : (
              <Center py={10}>
                <Text>No accepted requests</Text>
              </Center>
            )}
          </TabPanel>

          {/* Rejected Requests Tab */}
          <TabPanel px={0}>
            {filteredRequests.filter(r => r.status === 'Rejected').length >
            0 ? (
              <SimpleGrid columns={columnCount} spacing={4}>
                {filteredRequests
                  .filter(r => r.status === 'Rejected')
                  .map(request => (
                    <RequestCard key={request._id} request={request} />
                  ))}
              </SimpleGrid>
            ) : (
              <Center py={10}>
                <Text>No rejected requests</Text>
              </Center>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex justifyContent='center' mt={8}>
        <Button
          colorScheme='blue'
          onClick={() => (window.location.href = '/contact')}
        >
          Find a Doctor
        </Button>
      </Flex>
    </Container>
  );
};

export default MyRequestPage;
