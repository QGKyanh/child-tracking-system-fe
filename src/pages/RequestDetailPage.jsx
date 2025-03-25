import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Badge,
  Flex,
  Grid,
  GridItem,
  Avatar,
  VStack,
  HStack,
  Divider,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  useToast,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChatIcon,
  CalendarIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import { useGetDetailRequestByIdQuery } from '@/services/request/requestApi';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/services/auth/authSlice';

const RequestDetailPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const toast = useToast();

  const {
    data: requestData,
    isLoading,
    error,
  } = useGetDetailRequestByIdQuery(requestId);

  const request = requestData?.request;

  // Function to calculate age from birthdate
  const calculateAge = birthDate => {
    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return `${years}y ${months}m ${days}d`;
  };

  // Format date for display
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get badge color for request status
  const getStatusColor = status => {
    switch (status) {
      case 'Pending':
        return 'yellow';
      case 'Accepted':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Format allergy types for display
  const formatAllergy = allergyType => {
    switch (allergyType) {
      case 'DRUG_ALLERGY':
        return 'Drug';
      case 'FOOD_ALLERGY':
        return 'Food';
      case 'MOLD_ALLERGY':
        return 'Mold';
      case 'INSECT_ALLERGY':
        return 'Insect';
      case 'LATEX_ALLERGY':
        return 'Latex';
      case 'PET_ALLERGY':
        return 'Pet';
      case 'POLLEN_ALLERGY':
        return 'Pollen';
      case 'OTHER_ALLERGY':
        return 'Other';
      default:
        return allergyType;
    }
  };

  // Format feeding types for display
  const formatFeedingType = type => {
    switch (type) {
      case 'BREASTFEEDING':
        return 'Breastfeeding';
      case 'FORMULA_FEEDING':
        return 'Formula Feeding';
      case 'MIXED_FEEDING':
        return 'Mixed Feeding';
      case 'SOLID_FOODS':
        return 'Solid Foods';
      default:
        return type;
    }
  };

  // Function to navigate to consultation chat if available
  const handleStartChat = consultationId => {
    // This would need the actual consultationId that matches this request
    // For now, we'll just show a toast that this functionality is not implemented
    toast({
      title: 'Chat functionality',
      description:
        'Chat with doctor is only available after the consultation has been created.',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  if (isLoading) {
    return (
      <Container maxW='container.lg' py={8} centerContent>
        <Spinner size='xl' thickness='4px' color='blue.500' mt={20} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW='container.lg' py={8}>
        <Alert status='error' borderRadius='md'>
          <AlertIcon />
          Failed to load request details. Please try again later.
        </Alert>
      </Container>
    );
  }

  if (!request) {
    return (
      <Container maxW='container.lg' py={8}>
        <Alert status='warning' borderRadius='md'>
          <AlertIcon />
          Request not found or you don't have permission to view it.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW='container.lg' py={8}>
      <Button
        leftIcon={<ChevronLeftIcon />}
        variant='ghost'
        mb={4}
        onClick={() => navigate('/user/requests')}
      >
        Back to My Requests
      </Button>

      <Card
        shadow='md'
        borderRadius='lg'
        overflow='hidden'
        bg={useColorModeValue('white', 'gray.700')}
        mb={6}
      >
        <CardHeader bg='blue.50' py={4}>
          <Flex justify='space-between' align='center'>
            <Box>
              <Heading size='lg' color='blue.600'>
                {request.title}
              </Heading>
              <HStack mt={2}>
                <Badge
                  colorScheme={getStatusColor(request.status)}
                  fontSize='sm'
                  px={2}
                  py={1}
                  borderRadius='full'
                >
                  {request.status}
                </Badge>
                <Text fontSize='sm' color='gray.500'>
                  Submitted on {formatDate(request.createdAt)}
                </Text>
              </HStack>
            </Box>
            {/* {request.status === 'Accepted' && (
              <Button
                leftIcon={<ChatIcon />}
                colorScheme='blue'
                size='sm'
                onClick={() => handleStartChat(request._id)}
              >
                Chat with Doctor
              </Button>
            )} */}
          </Flex>
        </CardHeader>

        <CardBody p={6}>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
            {/* Doctor Information */}
            <GridItem>
              <Box p={4} borderRadius='md' borderWidth='1px' height='100%'>
                <Heading size='md' mb={4} color='blue.600'>
                  Doctor Information
                </Heading>
                <Flex align='center'>
                  <Avatar
                    size='lg'
                    name={request.doctor?.name}
                    src={request.doctor?.avatar}
                    mr={4}
                  />
                  <VStack align='start' spacing={1}>
                    <Text fontWeight='bold'>{request.doctor?.name}</Text>
                    <Text fontSize='sm' color='gray.600'>
                      Doctor ID: {request.doctor?._id}
                    </Text>
                  </VStack>
                </Flex>
              </Box>
            </GridItem>

            {/* Parent Information */}
            <GridItem>
              <Box p={4} borderRadius='md' borderWidth='1px' height='100%'>
                <Heading size='md' mb={4} color='blue.600'>
                  Parent Information
                </Heading>
                <Flex align='center'>
                  <Avatar
                    size='lg'
                    name={request.member?.name}
                    src={request.member?.avatar}
                    mr={4}
                  />
                  <VStack align='start' spacing={1}>
                    <Text fontWeight='bold'>{request.member?.name}</Text>
                    <Text fontSize='sm' color='gray.600'>
                      Member ID: {request.member?._id}
                    </Text>
                  </VStack>
                </Flex>
              </Box>
            </GridItem>
          </Grid>

          <Divider my={6} />

          <Heading size='md' mb={4} color='blue.600'>
            Children Information
          </Heading>

          <Tabs colorScheme='blue' isLazy>
            <TabList>
              {request.children?.map((child, index) => (
                <Tab key={child._id}>
                  Child {index + 1}: {child.name}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {request.children?.map(child => (
                <TabPanel key={child._id} px={0}>
                  <Card variant='outline' mb={4}>
                    <CardBody>
                      <Grid
                        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
                        gap={4}
                      >
                        <GridItem>
                          <VStack align='start' spacing={3}>
                            <HStack>
                              <Badge
                                colorScheme={
                                  child.gender === 0 ? 'pink' : 'blue'
                                }
                              >
                                {child.gender === 0 ? 'Girl' : 'Boy'}
                              </Badge>
                              <Text fontWeight='medium'>{child.name}</Text>
                            </HStack>

                            <HStack>
                              <CalendarIcon color='blue.500' />
                              <Text>Age: {calculateAge(child.birthDate)}</Text>
                            </HStack>

                            <HStack alignItems='flex-start'>
                              <InfoIcon color='blue.500' mt={1} />
                              <Box>
                                <Text fontWeight='medium'>Feeding Type:</Text>
                                <Text>
                                  {formatFeedingType(child.feedingType)}
                                </Text>
                              </Box>
                            </HStack>

                            {child.note && (
                              <HStack alignItems='flex-start'>
                                <InfoIcon color='blue.500' mt={1} />
                                <Box>
                                  <Text fontWeight='medium'>Notes:</Text>
                                  <Text>{child.note}</Text>
                                </Box>
                              </HStack>
                            )}
                          </VStack>
                        </GridItem>

                        <GridItem>
                          <Box>
                            <Text fontWeight='medium' mb={2}>
                              Allergies:
                            </Text>
                            {child.allergies && child.allergies.length > 0 ? (
                              <Flex wrap='wrap' gap={2}>
                                {child.allergies.map((allergy, index) => (
                                  <Badge
                                    key={index}
                                    colorScheme='red'
                                    variant='solid'
                                    px={2}
                                    py={1}
                                    borderRadius='md'
                                  >
                                    {formatAllergy(allergy)}
                                  </Badge>
                                ))}
                              </Flex>
                            ) : (
                              <Text fontSize='sm' color='gray.500'>
                                No allergies reported
                              </Text>
                            )}
                          </Box>

                          <Box mt={4}>
                            <Text fontWeight='medium' mb={2}>
                              Relationships:
                            </Text>
                            {child.relationships &&
                            child.relationships.length > 0 ? (
                              <VStack align='start' spacing={1}>
                                {child.relationships.map((rel, index) => (
                                  <Text key={index} fontSize='sm'>
                                    {rel.type} (Member ID: {rel.memberId})
                                  </Text>
                                ))}
                              </VStack>
                            ) : (
                              <Text fontSize='sm' color='gray.500'>
                                No relationships specified
                              </Text>
                            )}
                          </Box>
                        </GridItem>
                      </Grid>

                      <Divider my={4} />

                      <Box>
                        <Heading size='sm' mb={3}>
                          Growth Data
                        </Heading>
                        {child.growthVelocityResult &&
                        child.growthVelocityResult.some(
                          item =>
                            item.weight.percentile > 0 ||
                            item.height.percentile > 0 ||
                            item.headCircumference.percentile > 0
                        ) ? (
                          <Button
                            size='sm'
                            colorScheme='teal'
                            onClick={() => navigate(`/children/${child._id}`)}
                          >
                            View Complete Growth Data
                          </Button>
                        ) : (
                          <Text fontSize='sm' color='gray.500'>
                            No significant growth data available yet
                          </Text>
                        )}
                      </Box>
                    </CardBody>
                  </Card>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>

          <Flex justify='center' mt={6} gap={4}>
            <Button colorScheme='blue' onClick={() => navigate(-1)}>
              Back
            </Button>
            {request.status === 'Accepted' && (
              <Button
                colorScheme='teal'
                leftIcon={<ChatIcon />}
                onClick={() => {
                  navigate(`/consultations`);
                }}
              >
                Go to Consultations
              </Button>
            )}
          </Flex>
        </CardBody>
      </Card>
    </Container>
  );
};

export default RequestDetailPage;
