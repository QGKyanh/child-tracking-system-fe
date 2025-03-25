import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  VStack,
  useToast,
  InputGroup,
  InputRightAddon,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  FormErrorMessage,
} from '@chakra-ui/react';
import {
  useCreateGrowthDataMutation,
  useUpdateGrowthDataMutation,
  useGetGrowthDataByIdQuery,
} from '@/services/child/childApi';

const GrowthDataForm = ({
  isOpen,
  onClose,
  childId,
  growthDataId = null,
  isEditing = false,
  onSuccess,
}) => {
  const toast = useToast();

  // State for form data
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
    headCircumference: '',
    armCircumference: '',
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // API mutations
  const [createGrowthData, { isLoading: isCreating }] =
    useCreateGrowthDataMutation();
  const [updateGrowthData, { isLoading: isUpdating }] =
    useUpdateGrowthDataMutation();

  // Fetch existing data if editing
  const {
    data: existingData,
    isLoading: isFetchingData,
    isError: isFetchError,
  } = useGetGrowthDataByIdQuery(
    { childId, _id: growthDataId },
    { skip: !isEditing || !growthDataId }
  );

  // Handle combined loading state
  const isLoading = isCreating || isUpdating || (isEditing && isFetchingData);

  // Populate form with existing data when editing
  useEffect(() => {
    if (isEditing && existingData?.growthData) {
      const data = existingData.growthData;
      setFormData({
        date: data.inputDate
          ? new Date(data.inputDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        height: data.height?.toString() || '',
        weight: data.weight?.toString() || '',
        headCircumference: data.headCircumference?.toString() || '',
        armCircumference: data.armCircumference?.toString() || '',
      });
    }
  }, [isEditing, existingData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else if (parseFloat(formData.height) <= 0) {
      newErrors.height = 'Height must be greater than 0';
    }

    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }

    // Optional fields only validate if they have values
    if (
      formData.headCircumference &&
      parseFloat(formData.headCircumference) <= 0
    ) {
      newErrors.headCircumference = 'Head circumference must be greater than 0';
    }

    if (
      formData.armCircumference &&
      parseFloat(formData.armCircumference) <= 0
    ) {
      newErrors.armCircumference = 'Arm circumference must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data object
      const growthDataPayload = {
        childId,
        inputDate: formData.date,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
      };

      // Add optional fields if they exist
      if (formData.headCircumference) {
        growthDataPayload.headCircumference = parseFloat(
          formData.headCircumference
        );
      }

      if (formData.armCircumference) {
        growthDataPayload.armCircumference = parseFloat(
          formData.armCircumference
        );
      }

      // If editing, add ID and preserve growth results if they exist
      if (isEditing && growthDataId) {
        growthDataPayload._id = growthDataId;

        // Preserve existing growth result data
        if (existingData?.growthData?.growthResult) {
          growthDataPayload.growthResult = existingData.growthData.growthResult;
        }

        await updateGrowthData(growthDataPayload).unwrap();

        toast({
          title: 'Measurement updated',
          description: 'The growth data has been updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new measurement
        await createGrowthData(growthDataPayload).unwrap();

        toast({
          title: 'Measurement added',
          description: 'The growth data has been recorded successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      toast({
        title: isEditing
          ? 'Error updating measurement'
          : 'Error adding measurement',
        description: error.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Show loading state while fetching data for editing
  if (isEditing && isFetchingData) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Growth Measurement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center py={6}>
              <Spinner size='xl' />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  // Show error if data fetch fails
  if (isEditing && isFetchError) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Growth Measurement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status='error'>
              <AlertIcon />
              Failed to load measurement data. Please try again.
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing ? 'Edit Growth Measurement' : 'Add Growth Measurement'}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={errors.date}>
                <FormLabel>Date</FormLabel>
                <Input
                  type='date'
                  value={formData.date}
                  onChange={e => handleChange('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.date && (
                  <FormErrorMessage>{errors.date}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={errors.height}>
                <FormLabel>Height</FormLabel>
                <InputGroup>
                  <Input
                    type='number'
                    step='0.1'
                    min='0'
                    value={formData.height}
                    onChange={e => handleChange('height', e.target.value)}
                    placeholder='Enter height'
                  />
                  <InputRightAddon>cm</InputRightAddon>
                </InputGroup>
                {errors.height && (
                  <FormErrorMessage>{errors.height}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isRequired isInvalid={errors.weight}>
                <FormLabel>Weight</FormLabel>
                <InputGroup>
                  <Input
                    type='number'
                    step='0.1'
                    min='0'
                    value={formData.weight}
                    onChange={e => handleChange('weight', e.target.value)}
                    placeholder='Enter weight'
                  />
                  <InputRightAddon>kg</InputRightAddon>
                </InputGroup>
                {errors.weight && (
                  <FormErrorMessage>{errors.weight}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={errors.headCircumference}>
                <FormLabel>Head Circumference (optional)</FormLabel>
                <InputGroup>
                  <Input
                    type='number'
                    step='0.1'
                    min='0'
                    value={formData.headCircumference}
                    onChange={e =>
                      handleChange('headCircumference', e.target.value)
                    }
                    placeholder='Enter head circumference'
                  />
                  <InputRightAddon>cm</InputRightAddon>
                </InputGroup>
                {errors.headCircumference && (
                  <FormErrorMessage>
                    {errors.headCircumference}
                  </FormErrorMessage>
                )}
                <FormHelperText>
                  Particularly important for infants under 2 years
                </FormHelperText>
              </FormControl>

              <FormControl isInvalid={errors.armCircumference}>
                <FormLabel>Arm Circumference (optional)</FormLabel>
                <InputGroup>
                  <Input
                    type='number'
                    step='0.1'
                    min='0'
                    value={formData.armCircumference}
                    onChange={e =>
                      handleChange('armCircumference', e.target.value)
                    }
                    placeholder='Enter arm circumference'
                  />
                  <InputRightAddon>cm</InputRightAddon>
                </InputGroup>
                {errors.armCircumference && (
                  <FormErrorMessage>{errors.armCircumference}</FormErrorMessage>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button onClick={onClose} variant='outline'>
                Cancel
              </Button>
              <Button
                type='submit'
                colorScheme='blue'
                isLoading={isLoading}
                loadingText={isEditing ? 'Updating' : 'Saving'}
              >
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default GrowthDataForm;
