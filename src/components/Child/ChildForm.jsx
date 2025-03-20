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
  FormErrorMessage,
  HStack,
  useToast,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import {
  useCreateChildMutation,
  useUpdateChildMutation,
} from '@/services/child/childApi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AllergiesList from './AllergiesList';

const feedingTypes = ['Breastfeeding', 'Formula', 'Mixed', 'Solid Foods'];
const relationshipTypes = ['Parent', 'Guardian', 'Sibling', 'Other'];

const ChildForm = ({ isOpen, onClose, childData, isEditMode }) => {
  const [createChild, { isLoading: isCreating }] = useCreateChildMutation();
  const [updateChild, { isLoading: isUpdating }] = useUpdateChildMutation();
  const toast = useToast();

  // Track form initialization to prevent infinite loops
  const [isInitialized, setIsInitialized] = useState(false);

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    gender: Yup.number().required('Gender is required'),
    birthDate: Yup.date()
      .required('Birth date is required')
      .max(new Date(), 'Birth date cannot be in the future'),
    relationship: Yup.string().required('Relationship is required'),
    feedingType: Yup.string(),
    allergies: Yup.array().of(Yup.string()),
    note: Yup.string(),
  });

  // Form handling
  const formik = useFormik({
    initialValues: {
      name: '',
      gender: 0,
      birthDate: '',
      note: '',
      relationship: 'Parent',
      feedingType: 'Breastfeeding',
      allergies: ['NONE'],
    },
    validationSchema,
    onSubmit: async values => {
      // Format date for API
      const formattedValues = {
        ...values,
        birthDate: new Date(values.birthDate).toISOString(),
        // Send allergies as a single string if only one value is selected
        allergies:
          values.allergies.length === 1
            ? values.allergies[0]
            : values.allergies,
      };

      try {
        if (isEditMode && childData) {
          await updateChild({
            ...formattedValues,
            _id: childData._id,
          }).unwrap();
          toast({
            title: 'Child updated',
            description: `${values.name}'s information has been updated.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          await createChild(formattedValues).unwrap();
          toast({
            title: 'Child added',
            description: `${values.name} has been added successfully.`,
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
    },
  });

  // Set initial form values when editing
  useEffect(() => {
    // Only initialize the form when modal opens or childData changes
    if (isOpen && !isInitialized) {
      if (isEditMode && childData) {
        // Format date for form input (YYYY-MM-DD)
        const formattedDate = new Date(childData.birthDate)
          .toISOString()
          .split('T')[0];

        // Convert allergies from string to array if needed
        let allergiesValue;
        if (!childData.allergies) {
          allergiesValue = ['NONE'];
        } else if (typeof childData.allergies === 'string') {
          allergiesValue = [childData.allergies];
        } else {
          allergiesValue = childData.allergies;
        }

        // Initialize with existing data
        formik.setValues({
          name: childData.name || '',
          gender: childData.gender ?? 0,
          birthDate: formattedDate,
          note: childData.note || '',
          relationship: childData.relationships?.[0]?.type || 'Parent',
          feedingType: childData.feedingType || 'Breastfeeding',
          allergies: allergiesValue,
        });
      } else {
        // Initialize with defaults for new child
        formik.setValues({
          name: '',
          gender: 0,
          birthDate: '',
          note: '',
          relationship: 'Parent',
          feedingType: 'Breastfeeding',
          allergies: ['NONE'],
        });
      }
      setIsInitialized(true);
    }

    // Reset initialization flag when modal closes
    if (!isOpen) {
      setIsInitialized(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isEditMode, childData, isInitialized]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditMode ? 'Edit Child' : 'Add New Child'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <VStack spacing={4} align='stretch'>
              <FormControl
                isInvalid={formik.touched.name && formik.errors.name}
                isRequired
              >
                <FormLabel>Name</FormLabel>
                <Input
                  id='name'
                  name='name'
                  placeholder="Child's name"
                  {...formik.getFieldProps('name')}
                />
                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.touched.gender && formik.errors.gender}
                isRequired
              >
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  onChange={value =>
                    formik.setFieldValue('gender', parseInt(value))
                  }
                  value={formik.values.gender.toString()}
                  colorScheme='blue'
                >
                  <Stack direction='row'>
                    <Radio value='0'>Boy</Radio>
                    <Radio value='1'>Girl</Radio>
                  </Stack>
                </RadioGroup>
                <FormErrorMessage>{formik.errors.gender}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.touched.birthDate && formik.errors.birthDate}
                isRequired
              >
                <FormLabel>Birth Date</FormLabel>
                <Input
                  id='birthDate'
                  name='birthDate'
                  type='date'
                  max={new Date().toISOString().split('T')[0]}
                  {...formik.getFieldProps('birthDate')}
                />
                <FormErrorMessage>{formik.errors.birthDate}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  formik.touched.relationship && formik.errors.relationship
                }
                isRequired
              >
                <FormLabel>Relationship</FormLabel>
                <Select
                  id='relationship'
                  name='relationship'
                  {...formik.getFieldProps('relationship')}
                >
                  {relationshipTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {formik.errors.relationship}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Feeding Type</FormLabel>
                <Select
                  id='feedingType'
                  name='feedingType'
                  {...formik.getFieldProps('feedingType')}
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
                  values={formik.values.allergies}
                  onChange={newValues =>
                    formik.setFieldValue('allergies', newValues)
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  id='note'
                  name='note'
                  placeholder='Any additional information'
                  rows={3}
                  {...formik.getFieldProps('note')}
                />
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
                isLoading={isCreating || isUpdating}
                loadingText={isEditMode ? 'Updating' : 'Creating'}
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
