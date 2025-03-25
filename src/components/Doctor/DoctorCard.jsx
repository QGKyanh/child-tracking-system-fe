import React, { useState } from 'react';
import {
  Box,
  Button,
  Avatar,
  Text,
  Flex,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  VStack,
  HStack,
  useToast,
  FormHelperText,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Icon,
} from '@chakra-ui/react';
import { PhoneIcon, EmailIcon } from '@chakra-ui/icons';
import { useCreateRequestMutation } from '@/services/request/requestApi';
import { FaRegStar, FaStar } from 'react-icons/fa';

const DoctorCard = ({ doctor, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [createRequest, { isLoading }] = useCreateRequestMutation();
  const toast = useToast();

  const handleConsultationRequest = async () => {
    try {
      if (!title.trim() || selectedChildren.length === 0) {
        toast({
          title: 'Missing information',
          description: 'Please fill in all required fields',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const requestData = {
        childIds: selectedChildren,
        doctorId: doctor._id,
        title: title,
      };

      await createRequest(requestData).unwrap();

      toast({
        title: 'Request created',
        description: 'Your consultation request has been sent successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      
      setTitle('');
      setSelectedChildren([]);
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create request. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Failed to create request:', error);
    }
  };

  
  const handleSelectChild = e => {
    const selectedId = e.target.value;
    if (selectedId && !selectedChildren.includes(selectedId)) {
      setSelectedChildren([...selectedChildren, selectedId]);
    }
    
    e.target.value = '';
  };

  
  const removeChild = childId => {
    setSelectedChildren(selectedChildren.filter(id => id !== childId));
  };

  
  const getChildName = childId => {
    const child = children.find(c => c._id === childId);
    return child ? child.name : 'Unknown';
  };

  const renderStarRating = (rating) => {
    if (!rating && rating !== 0) return <Text fontSize="sm" color="gray.500">No rating</Text>;
    const maxRating = 5; 
    const filledStars = Math.round(rating); 
    const stars = [];

    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        <Icon
          key={i}
          as={i <= filledStars ? FaStar : FaRegStar} 
          color={i <= filledStars ? 'yellow.400' : 'gray.300'} 
          boxSize={5} 
        />
      );
    }
    return stars;
  };

  return (
    <>
      <Box
        borderWidth='1px'
        borderRadius='lg'
        p={4}
        boxShadow='md'
        _hover={{ boxShadow: 'lg' }}
        transition='box-shadow 0.2s'
        bg='white'
      >
        <Flex direction='column' align='stretch'>
          <Flex mb={4} align='center'>
            <Avatar size='lg' src={doctor.avatar} name={doctor.name} />
            <Box ml={4}>
              <Text fontWeight='bold' fontSize='lg'>
                {doctor.name}
              </Text>
              <Box mt={1}>{renderStarRating(doctor.rating)}</Box>
            </Box>
          </Flex>

          <HStack mb={2}>
            <PhoneIcon />
            <Text>{doctor.phoneNumber}</Text>
          </HStack>

          <HStack mb={4}>
            <EmailIcon />
            <Text>{doctor.email}</Text>
          </HStack>

          <Button colorScheme='blue' onClick={onOpen}>
            Request Consultation
          </Button>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Consultation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Consultation Title</FormLabel>
                <Input
                  placeholder='Enter a title for your consultation'
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Select Children</FormLabel>
                {children && children.length > 0 ? (
                  <>
                    <Select
                      placeholder='+ Add child to consultation'
                      onChange={handleSelectChild}
                    >
                      {children
                        .filter(child => !selectedChildren.includes(child._id))
                        .map(child => (
                          <option key={child._id} value={child._id}>
                            {child.name}
                          </option>
                        ))}
                    </Select>

                    {selectedChildren.length > 0 && (
                      <Box mt={3}>
                        <Text fontSize='sm' mb={2}>
                          Selected children:
                        </Text>
                        <Wrap spacing={2}>
                          {selectedChildren.map(childId => (
                            <WrapItem key={childId}>
                              <Tag
                                size='md'
                                borderRadius='full'
                                variant='solid'
                                colorScheme='blue'
                              >
                                <TagLabel>{getChildName(childId)}</TagLabel>
                                <TagCloseButton
                                  onClick={() => removeChild(childId)}
                                />
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>
                    )}
                  </>
                ) : (
                  <Text color='red.500'>No children available</Text>
                )}
                <FormHelperText>
                  {selectedChildren.length > 0
                    ? `${selectedChildren.length} children selected`
                    : 'Please select at least one child'}
                </FormHelperText>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme='blue'
              isLoading={isLoading}
              onClick={handleConsultationRequest}
              isDisabled={selectedChildren.length === 0 || !title.trim()}
            >
              Submit Request
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DoctorCard;
