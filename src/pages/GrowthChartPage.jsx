import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Button,
  Select,
  VStack,
  HStack,
  Spinner,
  Badge,
  Alert,
  AlertIcon,
  Grid,
  GridItem,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import {
  useGetListChildrenQuery,
  useGetChildByIdQuery,
  useGetGrowthDataQuery,
  useDeleteGrowthDataMutation,
} from '@/services/child/childApi';
import GrowthChart from '@/components/Child/ChildGrowth/GrowthChart';
import PercentileDisplay from '@/components/Child/ChildGrowth/PercentileDisplay';
import GrowthDataForm from '@/components/Child/ChildGrowth/GrowthDataForm';

const GrowthChartPage = () => {
  const { childId: urlChildId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const formatDate = dateString => {
    try {
      if (!dateString) return 'No date';
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'PPP');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid date';
    }
  };

  // State
  const [selectedChildId, setSelectedChildId] = useState(urlChildId || '');

  // Modals
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();

  // API Hooks
  const { data: childrenData, isLoading: isLoadingChildren } =
    useGetListChildrenQuery();
  const { data: childData, isLoading: isLoadingChild } = useGetChildByIdQuery(
    selectedChildId,
    {
      skip: !selectedChildId,
    }
  );
  const { data: growthData, isLoading: isLoadingGrowth } =
    useGetGrowthDataQuery(selectedChildId, {
      skip: !selectedChildId,
    });
  const [deleteGrowthData] = useDeleteGrowthDataMutation();

  // Update URL when child selection changes
  useEffect(() => {
    if (selectedChildId) {
      navigate(`/growth-charts/${selectedChildId}`);
    }
  }, [selectedChildId, navigate]);

  // Initialize with URL child ID or first child when data loads
  useEffect(() => {
    if (!isLoadingChildren && childrenData?.children?.length > 0) {
      if (!selectedChildId && !urlChildId) {
        setSelectedChildId(childrenData.children[0]._id);
      }
    }
  }, [isLoadingChildren, childrenData, selectedChildId, urlChildId]);

  // Handle child selection change
  const handleChildChange = e => {
    setSelectedChildId(e.target.value);
  };

  // Handle growth data deletion
  const handleDeleteGrowthData = async growthDataId => {
    if (!window.confirm('Are you sure you want to delete this measurement?'))
      return;

    try {
      await deleteGrowthData({
        childId: selectedChildId,
        _id: growthDataId,
      }).unwrap();

      toast({
        title: 'Measurement deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting measurement',
        description: error.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Get the latest growth data point
  const latestGrowthData = (() => {
    try {
      if (!growthData?.growthData?.length) return null;

      // Create a safe copy and sort by date (use inputDate from API)
      return (
        [...growthData.growthData]
          .filter(
            item => item.inputDate && !isNaN(new Date(item.inputDate).getTime())
          )
          .sort((a, b) => new Date(b.inputDate) - new Date(a.inputDate))[0] ||
        null
      );
    } catch (error) {
      console.error('Error finding latest growth data:', error);
      return null;
    }
  })();

  const isLoading = isLoadingChildren || isLoadingChild || isLoadingGrowth;
  const hasChildren = childrenData?.children?.length > 0;

  return (
    <Container maxW='container.xl' py={6}>
      {/* Breadcrumb */}
      <Breadcrumb
        spacing='8px'
        separator={<ChevronRightIcon color='gray.500' />}
        mb={6}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to='/'>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to='/children'>
            Children
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Growth Charts</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Page Header */}
      <Flex justify='space-between' align='center' mb={6}>
        <Box>
          <Heading size='xl'>Growth Charts</Heading>
          <Text color='gray.600'>
            Track and visualize your child's growth over time
          </Text>
        </Box>

        {selectedChildId && (
          <Button
            leftIcon={<AddIcon />}
            colorScheme='blue'
            onClick={onFormOpen}
          >
            Add Measurement
          </Button>
        )}
      </Flex>

      {/* Child Selection */}
      {!isLoadingChildren && hasChildren && (
        <Box mb={6}>
          <Select
            placeholder='Select a child'
            value={selectedChildId}
            onChange={handleChildChange}
            maxW='400px'
          >
            {childrenData.children.map(child => (
              <option key={child._id} value={child._id}>
                {child.name} ({child.gender === 0 ? 'Boy' : 'Girl'})
              </option>
            ))}
          </Select>
        </Box>
      )}

      {/* Loading State */}
      {isLoading && (
        <Flex justify='center' my={10}>
          <Spinner size='xl' color='blue.500' />
        </Flex>
      )}

      {/* No Children State */}
      {!isLoading && !hasChildren && (
        <Alert status='info' mb={6}>
          <AlertIcon />
          You don't have any children added yet. Please add a child first to
          track growth.
          <Button
            as={RouterLink}
            to='/children'
            ml={4}
            size='sm'
            colorScheme='blue'
          >
            Add Child
          </Button>
        </Alert>
      )}

      {/* No Growth Data State */}
      {!isLoading &&
        selectedChildId &&
        childData &&
        growthData?.growthData?.length === 0 && (
          <Alert status='info' mb={6}>
            <AlertIcon />
            No growth data available for {childData.child?.name}. Add your first
            measurement to start tracking growth.
            <Button ml={4} size='sm' colorScheme='blue' onClick={onFormOpen}>
              Add Measurement
            </Button>
          </Alert>
        )}

      {/* Growth Data Display */}
      {!isLoading &&
        selectedChildId &&
        childData &&
        growthData?.growthData?.length > 0 && (
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
            <GridItem>
              {/* Growth Chart */}
              <GrowthChart
                growthData={growthData.growthData}
                childGender={childData.child?.gender || 0}
                birthDate={childData.child?.birthDate}
              />
            </GridItem>

            <GridItem>
              {/* Percentile Display */}
              <PercentileDisplay
                childData={childData.child}
                latestGrowthData={latestGrowthData}
              />

              {/* Recent Measurements */}
              <Box
                mt={6}
                p={4}
                borderWidth='1px'
                borderRadius='lg'
                bg='white'
                shadow='sm'
              >
                <Heading size='md' mb={4}>
                  Recent Measurements
                </Heading>

                {growthData.growthData.slice(0, 5).map(measurement => (
                  <Box
                    key={measurement._id}
                    p={3}
                    mb={2}
                    borderWidth='1px'
                    borderRadius='md'
                    _hover={{ bg: 'gray.50' }}
                  >
                    <Flex justify='space-between' align='center'>
                      <VStack align='start' spacing={1}>
                        <Badge>{formatDate(measurement.inputDate)}</Badge>
                        <HStack spacing={4} mt={1}>
                          <Text fontSize='sm'>
                            Height: {measurement.height} cm
                          </Text>
                          <Text fontSize='sm'>
                            Weight: {measurement.weight} kg
                          </Text>
                        </HStack>
                        {measurement.headCircumference && (
                          <Text fontSize='sm'>
                            Head: {measurement.headCircumference} cm
                          </Text>
                        )}
                        {/* Add indicator for growth status */}
                        {measurement.growthResult && (
                          <HStack mt={1}>
                            {measurement.growthResult.weight && (
                              <Badge
                                colorScheme={
                                  measurement.growthResult.weight.level ===
                                  'High'
                                    ? 'blue'
                                    : measurement.growthResult.weight.level ===
                                      'Low'
                                    ? 'orange'
                                    : measurement.growthResult.weight.level ===
                                      'Average'
                                    ? 'green'
                                    : measurement.growthResult.weight.level ===
                                      'Obese'
                                    ? 'red'
                                    : 'gray'
                                }
                                size='sm'
                              >
                                {measurement.growthResult.weight.level}
                              </Badge>
                            )}
                          </HStack>
                        )}
                      </VStack>

                      <Button
                        size='sm'
                        colorScheme='red'
                        variant='ghost'
                        onClick={() => handleDeleteGrowthData(measurement._id)}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Box>
                ))}

                {growthData.growthData.length > 5 && (
                  <Text
                    fontSize='sm'
                    color='gray.500'
                    textAlign='center'
                    mt={2}
                  >
                    Showing 5 of {growthData.growthData.length} measurements
                  </Text>
                )}
              </Box>
            </GridItem>
          </Grid>
        )}

      {/* Growth Data Form Modal */}
      {selectedChildId && (
        <GrowthDataForm
          isOpen={isFormOpen}
          onClose={onFormClose}
          childId={selectedChildId}
        />
      )}
    </Container>
  );
};

export default GrowthChartPage;
