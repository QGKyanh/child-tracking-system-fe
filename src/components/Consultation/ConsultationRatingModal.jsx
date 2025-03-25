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
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import {
  useGetDetailConsultationByIdQuery,
  useCreateConsultationRatingMutation,
  useUpdateConsultationRatingMutation,
  useDeleteConsultationRatingMutation,
} from '@/services/consultation/consultationApi';

const ConsultationRatingModal = ({ isOpen, onClose, consultationId }) => {
  const { data: consultation, isLoading } =
    useGetDetailConsultationByIdQuery(consultationId);
  const [createRating] = useCreateConsultationRatingMutation();
  const [updateRating] = useUpdateConsultationRatingMutation();
  const [deleteRating] = useDeleteConsultationRatingMutation();

  const [rating, setRating] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (consultation?.rating !== undefined) {
      setRating(consultation.rating);
    }
  }, [consultation]);

  const handleCreateOrUpdate = async () => {
    if (rating > 0) {
      try {
        await createRating({ id: consultationId, rating }).unwrap();
        console.log('create');
        toast({
          title: 'Rating submitted!',
          status: 'success',
          duration: 2000,
        });
        onClose();
      } catch (error) {
        console.log(error);
        toast({
          title: 'Error updating rating',
          status: 'error',
          duration: 2000,
        });
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRating(consultationId).unwrap();
      setRating(0);
      toast({ title: 'Rating deleted!', status: 'warning', duration: 2000 });
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error deleting rating',
        status: 'error',
        duration: 2000,
      });
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Rate Your Consultation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Your Rating (1-5)</FormLabel>
            <Input
              type='number'
              min='1'
              max='5'
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          {consultation?.rating ? (
            <>
              <Button colorScheme='blue' onClick={handleCreateOrUpdate} mr={3}>
                Update Rating
              </Button>
              <Button colorScheme='red' onClick={handleDelete}>
                Delete Rating
              </Button>
            </>
          ) : (
            <Button colorScheme='green' onClick={handleCreateOrUpdate}>
              Submit Rating
            </Button>
          )}
          <Button onClick={onClose} ml={3}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConsultationRatingModal;
