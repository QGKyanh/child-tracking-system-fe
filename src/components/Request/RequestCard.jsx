import React from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
  Avatar,
  HStack,
  VStack,
  Divider,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useDeleteRequestMutation } from '@/services/request/requestApi';
import { useNavigate } from 'react-router-dom';

const RequestCard = ({ request }) => {
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteRequestMutation();
  const navigate = useNavigate();
  const toast = useToast();

  const statusColors = {
    Pending: 'yellow',
    Accepted: 'green',
    Rejected: 'red',
  };

  const handleDelete = async () => {
    try {
      await deleteRequest(request._id).unwrap();
      toast({
        title: 'Request deleted',
        description: 'Your request has been successfully deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete request',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('Failed to delete request:', error);
    }
  };

  const handleViewDetails = () => {
    navigate(`/requests/${request._id}`);
  };

  return (
    <Box
      borderWidth='1px'
      borderRadius='lg'
      overflow='hidden'
      boxShadow='md'
      bg='white'
      p={4}
    >
      <Flex justifyContent='space-between' alignItems='center' mb={3}>
        <Text fontWeight='bold' fontSize='lg' noOfLines={1}>
          {request.title}
        </Text>
        <Badge
          colorScheme={statusColors[request.status]}
          fontSize='0.8em'
          px={2}
          py={1}
          borderRadius='full'
        >
          {request.status}
        </Badge>
      </Flex>

      <Divider mb={3} />

      <HStack spacing={4} mb={3}>
        <VStack align='start' spacing={1}>
          <Text fontSize='sm' color='gray.500'>
            Doctor
          </Text>
          <Flex align='center'>
            <Avatar
              size='sm'
              src={request.doctor?.avatar}
              name={request.doctor?.name}
              mr={2}
            />
            <Text fontWeight='medium'>{request.doctor?.name}</Text>
          </Flex>
        </VStack>

        <Divider orientation='vertical' height='40px' />

        <VStack align='start' spacing={1}>
          <Text fontSize='sm' color='gray.500'>
            Children
          </Text>
          <HStack>
            {request.children &&
              request.children.map(child => (
                <Badge key={child._id} colorScheme='blue' variant='subtle'>
                  {child.name}
                </Badge>
              ))}
          </HStack>
        </VStack>
      </HStack>

      <Text fontSize='sm' color='gray.500' mb={3}>
        Created on {new Date(request.createdAt).toLocaleDateString()}
      </Text>

      <Flex justifyContent='space-between' mt={2}>
        <Button
          size='sm'
          colorScheme='blue'
          variant='outline'
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        {request.status === 'Pending' && (
          <Button
            size='sm'
            colorScheme='red'
            variant='outline'
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Cancel Request
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default RequestCard;
