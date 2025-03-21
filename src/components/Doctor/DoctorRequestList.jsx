import {
    Box,
    VStack,
    HStack,
    Avatar,
    Text,
    Button,
    Badge,
    Divider,
  } from '@chakra-ui/react';
  
  const DoctorRequestList = ({ requests, onView, onUpdateStatus }) => {
    if (!requests.length) return <Text>No requests available.</Text>;
  
    return (
      <VStack spacing={4} align="stretch">
        {requests.map((request) => (
          <Box key={request._id} p={4} borderWidth={1} borderRadius="md">
            <HStack spacing={4}>
              <Avatar src={request.member.avatar || '/default-avatar.png'} />
              <Box flex="1">
                <Text fontWeight="bold">{request.member.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(request.createdAt).toLocaleDateString()}
                </Text>
                <Badge colorScheme={request.status === 'Accepted' ? 'green' : 'red'}>
                  {request.status}
                </Badge>
              </Box>
            </HStack>
            <Text mt={2}>{request.title}</Text>
            <Divider my={2} />
            <HStack spacing={2}>
              <Button colorScheme="blue" size="sm" onClick={() => onView(request._id)}>
                View Details
              </Button>
              <Button colorScheme="green" size="sm" onClick={() => onUpdateStatus(request._id, 'Accepted')}>
                Accept
              </Button>
              <Button colorScheme="red" size="sm" onClick={() => onUpdateStatus(request._id, 'Rejected')}>
                Reject
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    );
  };
  
  export default DoctorRequestList;
  