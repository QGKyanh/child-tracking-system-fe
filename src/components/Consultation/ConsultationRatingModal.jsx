import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  HStack,
  VStack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import {
  useGetDetailConsultationByIdQuery,
  useCreateConsultationRatingMutation,
} from '@/services/consultation/consultationApi';

const ConsultationRatingModal = ({ isOpen, onClose, consultationId }) => {
  const { data: consultation, isLoading } =
    useGetDetailConsultationByIdQuery(consultationId);
  const [createRating] = useCreateConsultationRatingMutation();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const toast = useToast();

  // Rating labels and descriptions
  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  const ratingDescriptions = {
    1: 'The consultation did not meet my expectations.',
    2: 'The consultation was adequate but could be improved.',
    3: 'The consultation was satisfactory.',
    4: 'The consultation was very helpful and informative.',
    5: 'The consultation was exceptional in all aspects.',
  };

  useEffect(() => {
    if (consultation?.rating !== undefined && consultation.rating > 0) {
      setRating(consultation.rating);
    } else {
      setRating(0);
    }
  }, [consultation]);

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast({
        title: 'Please select a rating',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      await createRating({
        id: consultationId,
        rating,
        feedback: feedback.trim() || undefined,
      }).unwrap();

      toast({
        title: 'Thank you for your feedback!',
        description: 'Your rating has been submitted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error submitting rating',
        description: error?.data?.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(5px)' />
      <ModalContent borderRadius='lg'>
        <ModalHeader
          bg='blue.50'
          borderTopRadius='lg'
          color='blue.600'
          textAlign='center'
          fontSize='xl'
          py={4}
        >
          Rate Your Consultation
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          {isLoading ? (
            <Box textAlign='center' py={4}>
              Loading...
            </Box>
          ) : (
            <VStack spacing={6} align='stretch'>
              <Box>
                <Text mb={3} fontWeight='medium'>
                  How would you rate your experience?
                </Text>

                <HStack justify='center' my={4} spacing={3}>
                  {[1, 2, 3, 4, 5].map(value => (
                    <Box
                      key={value}
                      cursor='pointer'
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHover(value)}
                      onMouseLeave={() => setHover(0)}
                      transition='all 0.2s'
                      transform={
                        rating === value || hover === value
                          ? 'scale(1.2)'
                          : 'scale(1)'
                      }
                    >
                      <StarIcon
                        w={8}
                        h={8}
                        color={
                          rating >= value || hover >= value
                            ? 'yellow.400'
                            : 'gray.200'
                        }
                      />
                    </Box>
                  ))}
                </HStack>

                <Box textAlign='center' minHeight='60px' transition='all 0.3s'>
                  {(hover > 0 || rating > 0) && (
                    <>
                      <Text fontWeight='bold' color='blue.600' fontSize='lg'>
                        {ratingLabels[hover || rating]}
                      </Text>
                      <Text fontSize='sm' color='gray.600'>
                        {ratingDescriptions[hover || rating]}
                      </Text>
                    </>
                  )}
                </Box>
              </Box>

              <Box>
                <Text mb={2} fontWeight='medium'>
                  Additional feedback (optional)
                </Text>
                <Textarea
                  placeholder='Share your thoughts about the consultation...'
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  minH='100px'
                  resize='vertical'
                  maxLength={500}
                />
                <Text fontSize='xs' textAlign='right' color='gray.500' mt={1}>
                  {feedback.length}/500 characters
                </Text>
              </Box>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter bg='gray.50' borderBottomRadius='lg'>
          <Button variant='outline' mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme='blue'
            onClick={handleSubmitRating}
            isDisabled={rating === 0 || isLoading}
            boxShadow='sm'
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'md',
            }}
            transition='all 0.2s'
          >
            Submit Rating
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConsultationRatingModal;
