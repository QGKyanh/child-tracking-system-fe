import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  Divider,
  Badge,
  Box,
  Avatar,
  Flex,
  SimpleGrid,
  IconButton,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useGetChildByIdQuery } from '@/services/child/childApi';
import { useEffect } from 'react';
import { EditIcon } from '@chakra-ui/icons';

const ChildDetail = ({ isOpen, onClose, childId, onEdit }) => {
  // Skip the query if modal is closed or no child is selected
  const {
    data: childResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetChildByIdQuery(childId, { skip: !isOpen || !childId });

  // Refetch when modal opens with a new child ID
  useEffect(() => {
    if (isOpen && childId) {
      refetch();
    }
  }, [isOpen, childId, refetch]);

  // Calculate age from birthdate
  const calculateAge = birthDate => {
    try {
      const today = new Date();
      const birth = new Date(birthDate);

      if (isNaN(birth.getTime())) {
        return 'Unknown age';
      }

      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();
      if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
        years--;
        months += 12;
      }

      if (years === 0) {
        return `${months} ${months === 1 ? 'month' : 'months'} old`;
      } else {
        return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${
          months === 1 ? 'month' : 'months'
        } old`;
      }
    } catch (error) {
      console.error('Error calculating age:', error);
      return 'Unknown age';
    }
  };

  // Get the child data from the response
  const child = childResponse?.child;

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Child Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center py={10}>
              <Spinner size='xl' color='blue.500' />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Child Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status='error'>
              <AlertIcon />
              Failed to load child details:{' '}
              {error?.data?.message || 'Unknown error'}
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  if (!child) return null;

  // Safely format date or return fallback
  const formatDate = dateString => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };

<<<<<<< HEAD
  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size='xl' color='blue.500' />
      </Center>
    );
  }

  if (isError || !child) {
    return (
      <Center py={10}>
        <Alert status='error'>
          <AlertIcon />
          {error?.data?.message || 'Failed to load child data'}
        </Alert>
      </Center>
    );
  }
console.log("child",child);
=======
>>>>>>> 247b6f8dd90434cfe50cbed3f0d2643adcf1b853
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='lg'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justify='space-between' align='center'>
            <Text>Child Details</Text>
            <IconButton
              icon={<EditIcon />}
              aria-label='Edit child'
              size='sm'
              colorScheme='blue'
              onClick={onEdit}
            />
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack align='stretch' spacing={4}>
            {/* Profile Header */}
            <Flex align='center' mb={2}>
              <Avatar
                size='xl'
                name={child.name}
                bg={child.gender === 0 ? 'blue.400' : 'pink.400'}
                color='white'
                mr={6}
              />
              <Box>
                <Heading size='lg'>{child.name}</Heading>
                <Badge
                  colorScheme={child.gender === 0 ? 'blue' : 'pink'}
                  fontSize='0.9em'
                  mt={1}
                >
                  {child.gender === 0 ? 'Boy' : 'Girl'}
                </Badge>
                <Text mt={2} fontSize='lg' color='gray.600'>
                  {calculateAge(child.birthDate)}
                </Text>
              </Box>
            </Flex>

            <Divider />

            {/* Basic Information */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontWeight='bold' fontSize='sm' color='gray.500'>
                  Birth Date
                </Text>
                <Text>{formatDate(child.birthDate)}</Text>
              </Box>

              <Box>
                <Text fontWeight='bold' fontSize='sm' color='gray.500'>
                  Relationship
                </Text>
                <Text>{child.relationships?.[0]?.type || 'Parent'}</Text>
              </Box>

              <Box>
                <Text fontWeight='bold' fontSize='sm' color='gray.500'>
                  Feeding Type
                </Text>
                <Text>{child.feedingType || 'Not specified'}</Text>
              </Box>

              <Box>
                <Text fontWeight='bold' fontSize='sm' color='gray.500'>
                  Added On
                </Text>
                <Text>{formatDate(child.createdAt)}</Text>
              </Box>
            </SimpleGrid>

            {/* Allergies Section */}
            {child.allergies && child.allergies.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Text fontWeight='bold' fontSize='sm' color='gray.500' mb={2}>
                    Allergies
                  </Text>
                  <Flex flexWrap='wrap' gap={2}>
                    {child.allergies.map((allergy, index) => (
                      <Badge
                        key={index}
                        colorScheme='red'
                        variant='solid'
                        px={2}
                        py={1}
                      >
                        {allergy}
                      </Badge>
                    ))}
                  </Flex>
                </Box>
              </>
            )}

            {/* Notes Section */}
            {child.note && (
              <>
                <Divider />
                <Box>
                  <Text fontWeight='bold' fontSize='sm' color='gray.500'>
                    Notes
                  </Text>
                  <Text whiteSpace='pre-wrap'>{child.note}</Text>
                </Box>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onEdit}>
            Edit
          </Button>
          <Button variant='ghost' onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChildDetail;
