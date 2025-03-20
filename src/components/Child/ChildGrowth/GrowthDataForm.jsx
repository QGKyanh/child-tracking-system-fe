import {
  Box,
  Button,
  FormControl,
  FormLabel,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useCreateGrowthDataMutation } from '@/services/child/childApi';

const GrowthDataForm = ({ isOpen, onClose, childId }) => {
  const toast = useToast();
  const [createGrowthData, { isLoading }] = useCreateGrowthDataMutation();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
    headCircumference: '',
    armCircumference: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.height || !formData.weight) {
      toast({
        title: 'Required fields missing',
        description: 'Height and weight are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const dataToSubmit = {
        childId,
        inputDate: new Date(formData.date).toISOString(), // Ensure correct format for API
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
      };

      // Only add optional fields if they have values
      if (formData.headCircumference) {
        dataToSubmit.headCircumference = parseFloat(formData.headCircumference);
      }

      if (formData.armCircumference) {
        dataToSubmit.armCircumference = parseFloat(formData.armCircumference);
      }

      await createGrowthData(dataToSubmit).unwrap();

      toast({
        title: 'Growth data added',
        description: 'The growth data has been recorded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error adding growth data',
        description: error.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Growth Measurement</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type='date'
                  value={formData.date}
                  onChange={e => handleChange('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Height (cm)</FormLabel>
                <NumberInput
                  min={0}
                  precision={1}
                  value={formData.height}
                  onChange={value => handleChange('height', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Weight (kg)</FormLabel>
                <NumberInput
                  min={0}
                  precision={2}
                  value={formData.weight}
                  onChange={value => handleChange('weight', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Head Circumference (cm)</FormLabel>
                <NumberInput
                  min={0}
                  precision={1}
                  value={formData.headCircumference}
                  onChange={value => handleChange('headCircumference', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Arm Circumference (cm)</FormLabel>
                <NumberInput
                  min={0}
                  precision={1}
                  value={formData.armCircumference}
                  onChange={value => handleChange('armCircumference', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
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
                loadingText='Saving'
              >
                Save
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default GrowthDataForm;
