import { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  useToast,
  RadioGroup,
  Radio,
  Stack,
  Text,
} from '@chakra-ui/react';
import {
  useCreateChildMutation,
  useUpdateChildMutation,
  useGetChildByIdQuery,
} from '@/services/child/childApi';
import AllergiesList from './AllergiesList';

const feedingTypes = ['BREASTFEEDING', 'FORMULA_FEEDING', 'SOLID_FOODS', 'N/A'];
const relationshipTypes = ['Parent', 'Guardian', 'Sibling', 'Other'];

const ChildForm = ({ isOpen, onClose, childId = null }) => {
  const isEditMode = Boolean(childId);
  const toast = useToast();

  // API hooks
  const [createChild, { isLoading: isCreating }] = useCreateChildMutation();
  const [updateChild, { isLoading: isUpdating }] = useUpdateChildMutation();
  const {
    data: childData,
    isLoading: isLoadingChild,
    refetch,
  } = useGetChildByIdQuery(childId, {
    skip: !isEditMode || !isOpen,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    gender: 0,
    birthDate: '',
    note: '',
    relationship: 'Parent',
    feedingType: 'N/A',
    allergies: ['NONE'],
  });

  // Refetch child data when modal opens in edit mode
  useEffect(() => {
    if (isOpen && isEditMode && childId) {
      refetch();
    }
  }, [isOpen, isEditMode, childId, refetch]);

  // Initialize form with child data when editing
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && childData?.child) {
        const child = childData.child;

        // Format date for form input (YYYY-MM-DD)
        const formattedDate = new Date(child.birthDate)
          .toISOString()
          .split('T')[0];

        // Convert allergies from string to array if needed
        let allergiesValue;
        if (!child.allergies) {
          allergiesValue = ['NONE'];
        } else if (typeof child.allergies === 'string') {
          allergiesValue = [child.allergies];
        } else {
          allergiesValue = child.allergies;
        }

        // Initialize with existing data
        setFormData({
          name: child.name || '',
          gender: child.gender ?? 0,
          birthDate: formattedDate,
          note: child.note || '',
          relationship: child.relationships?.[0]?.type || 'Parent',
          feedingType: child.feedingType || 'N/A',
          allergies: allergiesValue,
        });

        console.log('Form initialized with child data:', {
          name: child.name,
          gender: child.gender,
          allergies: allergiesValue,
        });
      } else {
        // Initialize with defaults for new child
        setFormData({
          name: '',
          gender: 0,
          birthDate: '',
          note: '',
          relationship: 'Parent',
          feedingType: 'N/A',
          allergies: ['NONE'],
        });

        console.log('Form initialized with default values');
      }
    }
  }, [isOpen, isEditMode, childData]);

  // Handle input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle radio changes
  const handleGenderChange = value => {
    setFormData(prev => ({
      ...prev,
      gender: parseInt(value),
    }));
  };

  // Handle allergies changes
  const handleAllergiesChange = newValues => {
    console.log('Allergies changed to:', newValues);
    setFormData(prev => ({
      ...prev,
      allergies: newValues,
    }));
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();

    // Format date for API
    const formattedValues = {
      ...formData,
      birthDate: new Date(formData.birthDate).toISOString(),
    };

    try {
      if (isEditMode && childId) {
        await updateChild({
          ...formattedValues,
          _id: childId,
        }).unwrap();
        toast({
          title: 'Child updated',
          description: `${formData.name}'s information has been updated.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createChild(formattedValues).unwrap();
        toast({
          title: 'Child added',
          description: `${formData.name} has been added successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: 'Error',
        description: error.data?.validationErrors
          ? error.data.validationErrors.map(err => err.error).join(', ')
          : error.data?.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditMode ? 'Edit Child' : 'Add New Child'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            {isLoadingChild && isEditMode ? (
              <VStack p={6}>
                <Text>Loading child information...</Text>
              </VStack>
            ) : (
              <VStack spacing={4} align='stretch'>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Child's name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Gender</FormLabel>
                  <RadioGroup
                    onChange={handleGenderChange}
                    value={formData.gender.toString()}
                    colorScheme='blue'
                  >
                    <Stack direction='row'>
                      <Radio value='0'>Boy</Radio>
                      <Radio value='1'>Girl</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Birth Date</FormLabel>
                  <Input
                    name='birthDate'
                    type='date'
                    value={formData.birthDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Relationship</FormLabel>
                  <Select
                    name='relationship'
                    value={formData.relationship}
                    onChange={handleChange}
                  >
                    {relationshipTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Feeding Type</FormLabel>
                  <Select
                    name='feedingType'
                    value={formData.feedingType}
                    onChange={handleChange}
                  >
                    {feedingTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Allergies</FormLabel>
                  <AllergiesList
                    values={formData.allergies}
                    onChange={handleAllergiesChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    name='note'
                    value={formData.note}
                    onChange={handleChange}
                    placeholder='Any additional information'
                    rows={3}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button onClick={onClose} variant='outline'>
                Cancel
              </Button>
              <Button
                type='submit'
                colorScheme='blue'
                isLoading={
                  isCreating || isUpdating || (isEditMode && isLoadingChild)
                }
                loadingText={isEditMode ? 'Updating' : 'Creating'}
                isDisabled={isEditMode && isLoadingChild}
              >
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ChildForm;
