import { useState } from 'react';
import { Box, VStack, HStack, Avatar, Text, Button, Badge, Divider, Flex, Select } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const DoctorRequestList = ({ requests, totalPages, currentPage, setPage, onView, onUpdateStatus }) => {
  const [statusFilter, setStatusFilter] = useState("");  // State for status filter
  const navigate = useNavigate();

// Sort by newest createdAt first and then filter by status
const filteredRequests = Array.isArray(requests)
  ? requests
      .slice() // avoid mutating original array
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // sort mới nhất
      .filter((request) => {
        if (!statusFilter) return true;
        return request.status.toLowerCase() === statusFilter.toLowerCase();
      })
  : [];


  // Handle page change
  const handlePageChange = (page) => {
    setPage(Number(page));
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  if (!requests?.length) return <Text>No requests available.</Text>;

  return (
    <Box>
      {/* Status Filter */}
      <HStack mb={4}>
        <Select value={statusFilter} onChange={handleStatusChange} placeholder="Filter by Status" size="sm" width="200px">
          <option value="Accepted">Accepted</option>
          <option value="Pending">Pending</option>
          <option value="AdminApprove">AdminApprove</option>
          <option value="Rejected">Rejected</option>
        </Select>
      </HStack>

      <VStack spacing={4} align="stretch">
        {filteredRequests.map((request) => {
          const isPending = request.status === "Pending";
          const childIds = request.childIds || [];
console.log("filteredRequests:",filteredRequests);
          return (
            <Box key={request._id} p={4} borderWidth={1} borderRadius="lg" boxShadow="lg" transition="all 0.3s" _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}>
              {/* Top Section */}
              <Flex justify="space-between" align="flex-start" mb={2}>
                <HStack spacing={4}>
                  <Avatar src={request.member.avatar || "/default-avatar.png"} />
                  <Box>
                    <Text fontWeight="bold">{request.member.name}</Text>
                    <Text fontSize="sm" color="gray.500">{new Date(request.createdAt).toLocaleDateString()}</Text>
                  </Box>
                </HStack>
                <Badge colorScheme={request.status === "Accepted" ? "green" : request.status === "Rejected" ? "red" : "yellow"}>
                  {request.status}
                </Badge>
              </Flex>

              {/* Message */}
              <Text mt={2} mb={3}>{request.title}</Text>
              <Divider />

              {/* Bottom Actions */}
              <Flex justify="space-between" align="center" mt={3}>
              {childIds?.length >= 1 && (
  <HStack spacing={3}>
    {childIds.map((childId, index) => {
      const child = request.children?.find(c => c._id === childId);  // Find child by ID
      return (
        <Button
          key={index}
          size="sm"
          variant="outline"
          colorScheme="gray"
          onClick={() => navigate(`/children/${childId}`)}
        >
          View: {child?.name || `Child ${index + 1}`}
        </Button>
      );
    })}
  </HStack>
)}


                <HStack spacing={2}>
                  <Button colorScheme="blue" size="sm" onClick={() => onView(request._id)}>View Details</Button>

                  {isPending && (
                    <>
                      <Button colorScheme="green" size="sm" onClick={() => onUpdateStatus(request._id, "Accepted")}>Accept</Button>
                      <Button colorScheme="red" size="sm" onClick={() => onUpdateStatus(request._id, "Rejected")}>Reject</Button>
                    </>
                  )}
                </HStack>
              </Flex>
            </Box>
          );
        })}
      </VStack>

      {/* Pagination */}
      <HStack justify="center" mt={6} wrap="wrap">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button key={index} size="sm" variant={currentPage === index + 1 ? "solid" : "outline"} colorScheme="blue" onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

export default DoctorRequestList;
