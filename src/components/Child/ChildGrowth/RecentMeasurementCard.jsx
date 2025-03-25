import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  HStack,
  Badge,
  IconButton,
  Card,
  CardHeader,
  CardBody,
  Divider,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import {
  DeleteIcon,
  EditIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@chakra-ui/icons';
import { format } from 'date-fns';
import GrowthDataForm from './GrowthDataForm';
import { useDeleteGrowthDataMutation } from '@/services/child/childApi';

const RecentMeasurementCard = ({ childId, growthData = [], refetch }) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const toast = useToast();

  // Delete confirmation dialog
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const cancelRef = React.useRef();

  // Edit form modal
  const {
    isOpen: isEditFormOpen,
    onOpen: onEditFormOpen,
    onClose: onEditFormClose,
  } = useDisclosure();

  // Delete mutation
  const [deleteGrowthData, { isLoading: isDeleting }] =
    useDeleteGrowthDataMutation();

  // Format date helper
  const formatDate = dateString => {
    try {
      if (!dateString) return 'No date';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'PPP');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Get badge color based on growth level
  const getBadgeColor = level => {
    switch (level) {
      case 'High':
        return 'blue';
      case 'Low':
        return 'orange';
      case 'Average':
        return 'green';
      case 'Obese':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Handle measurement edit
  const handleEdit = measurementId => {
    setSelectedMeasurement(measurementId);
    onEditFormOpen();
  };

  // Handle delete confirmation
  const handleDeleteConfirm = measurementId => {
    setSelectedMeasurement(measurementId);
    onDeleteDialogOpen();
  };

  // Handle actual deletion
  const handleDelete = async () => {
    try {
      await deleteGrowthData({
        childId,
        _id: selectedMeasurement,
      }).unwrap();

      toast({
        title: 'Measurement deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (refetch) refetch();
      onDeleteDialogClose();
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

  // Toggle show all/less
  const toggleShowAll = () => setShowAll(!showAll);

  // Limit displayed measurements based on showAll state
  const displayedMeasurements = showAll ? growthData : growthData.slice(0, 3);

  return (
    <Card borderRadius='lg' boxShadow='sm'>
      <CardHeader pb={2}>
        <Flex justify='space-between' align='center'>
          <Heading size='md'>Recent Measurements</Heading>
          {growthData.length > 3 && (
            <Button
              size='sm'
              variant='ghost'
              rightIcon={showAll ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={toggleShowAll}
            >
              {showAll ? 'Show Less' : 'Show All'}
            </Button>
          )}
        </Flex>
      </CardHeader>

      <CardBody pt={0}>
        {displayedMeasurements.length === 0 ? (
          <Text color='gray.500' textAlign='center' py={4}>
            No measurements recorded yet
          </Text>
        ) : (
          displayedMeasurements.map((measurement, index) => (
            <Box
              key={measurement._id}
              p={3}
              mb={2}
              borderWidth='1px'
              borderRadius='md'
              _hover={{ bg: 'gray.50' }}
            >
              <Flex justify='space-between' align='flex-start'>
                <VStack align='start' spacing={1} width='100%'>
                  <Badge colorScheme='blue'>
                    {formatDate(measurement.inputDate)}
                  </Badge>

                  {/* Basic measurements */}
                  <HStack spacing={4} mt={1} flexWrap='wrap'>
                    <Text fontSize='sm'>
                      <Text as='span' fontWeight='bold'>
                        Height:
                      </Text>{' '}
                      {measurement.height} cm
                    </Text>
                    <Text fontSize='sm'>
                      <Text as='span' fontWeight='bold'>
                        Weight:
                      </Text>{' '}
                      {measurement.weight} kg
                    </Text>
                    {measurement.headCircumference && (
                      <Text fontSize='sm'>
                        <Text as='span' fontWeight='bold'>
                          Head:
                        </Text>{' '}
                        {measurement.headCircumference} cm
                      </Text>
                    )}
                  </HStack>

                  {/* Growth results section */}
                  {measurement.growthResult && (
                    <>
                      <Divider my={2} />
                      <Text fontSize='xs' color='gray.500' mb={1}>
                        Percentiles
                      </Text>
                      <HStack spacing={2} flexWrap='wrap'>
                        {measurement.growthResult.weight?.percentile > 0 && (
                          <Tooltip
                            label={measurement.growthResult.weight.description}
                          >
                            <Badge
                              colorScheme={getBadgeColor(
                                measurement.growthResult.weight.level
                              )}
                              variant='solid'
                              px={2}
                              py={1}
                            >
                              Weight:{' '}
                              {measurement.growthResult.weight.percentile.toFixed(
                                1
                              )}
                              %
                            </Badge>
                          </Tooltip>
                        )}

                        {measurement.growthResult.height?.percentile > 0 && (
                          <Tooltip
                            label={measurement.growthResult.height.description}
                          >
                            <Badge
                              colorScheme={getBadgeColor(
                                measurement.growthResult.height.level
                              )}
                              variant='solid'
                              px={2}
                              py={1}
                            >
                              Height:{' '}
                              {measurement.growthResult.height.percentile.toFixed(
                                1
                              )}
                              %
                            </Badge>
                          </Tooltip>
                        )}

                        {measurement.growthResult.bmi?.percentile > 0 && (
                          <Tooltip
                            label={measurement.growthResult.bmi.description}
                          >
                            <Badge
                              colorScheme={getBadgeColor(
                                measurement.growthResult.bmi.level
                              )}
                              variant='solid'
                              px={2}
                              py={1}
                            >
                              BMI:{' '}
                              {measurement.growthResult.bmi.percentile.toFixed(
                                1
                              )}
                              %
                            </Badge>
                          </Tooltip>
                        )}
                      </HStack>
                    </>
                  )}
                </VStack>

                <HStack>
                  <IconButton
                    aria-label='Edit measurement'
                    icon={<EditIcon />}
                    size='sm'
                    variant='ghost'
                    colorScheme='blue'
                    onClick={() => handleEdit(measurement._id)}
                  />
                  <IconButton
                    aria-label='Delete measurement'
                    icon={<DeleteIcon />}
                    size='sm'
                    variant='ghost'
                    colorScheme='red'
                    onClick={() => handleDeleteConfirm(measurement._id)}
                  />
                </HStack>
              </Flex>
            </Box>
          ))
        )}

        {!showAll && growthData.length > 3 && (
          <Text
            fontSize='sm'
            color='gray.500'
            textAlign='center'
            mt={2}
            cursor='pointer'
            onClick={toggleShowAll}
            _hover={{ textDecoration: 'underline' }}
          >
            Showing 3 of {growthData.length} measurements
          </Text>
        )}
      </CardBody>

      {/* Edit Form Modal */}
      {isEditFormOpen && (
        <GrowthDataForm
          isOpen={isEditFormOpen}
          onClose={() => {
            onEditFormClose();
            setSelectedMeasurement(null);
          }}
          childId={childId}
          growthDataId={selectedMeasurement}
          isEditing={true}
          onSuccess={() => {
            if (refetch) refetch();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Measurement
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this measurement? This action
              cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteDialogClose}>
                Cancel
              </Button>
              <Button
                colorScheme='red'
                onClick={handleDelete}
                ml={3}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Card>
  );
};

export default RecentMeasurementCard;
