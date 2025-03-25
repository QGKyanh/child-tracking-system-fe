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
  Spinner,
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
} from '@/services/child/childApi';
import GrowthChart from '@/components/Child/ChildGrowth/GrowthChart';
import PercentileDisplay from '@/components/Child/ChildGrowth/PercentileDisplay';
import GrowthDataForm from '@/components/Child/ChildGrowth/GrowthDataForm';
import RecentMeasurementCard from '@/components/Child/ChildGrowth/RecentMeasurementCard';

const GrowthChartPage = () => {
  const { childId: urlChildId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

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
  const {
    data: growthData,
    isLoading: isLoadingGrowth,
    refetch: refetchGrowthData,
  } = useGetGrowthDataQuery(selectedChildId, {
    skip: !selectedChildId,
  });

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

              {/* RecentMeasurementCard - Now Using Our New Component */}
              <Box mt={6}>
                <RecentMeasurementCard
                  childId={selectedChildId}
                  growthData={growthData.growthData}
                  refetch={refetchGrowthData}
                />
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
          onSuccess={refetchGrowthData}
        />
      )}
    </Container>
  );
};

export default GrowthChartPage;
