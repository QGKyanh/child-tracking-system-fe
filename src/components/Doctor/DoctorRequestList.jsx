import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Button,
  Badge,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const DoctorRequestList = ({ requests, onView, onUpdateStatus }) => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  // Xác định tổng số trang
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const displayedRequests = requests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (!requests.length) return <Text>No requests available.</Text>;

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {displayedRequests.map((request) => (
          <Box
            key={request._id}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
            transition="all 0.3s"
            _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
          >
            <HStack spacing={4}>
              <Avatar src={request.member.avatar || "/default-avatar.png"} />
              <Box flex="1">
                <Text fontWeight="bold">{request.member.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(request.createdAt).toLocaleDateString()}
                </Text>
                <Badge colorScheme={request.status === "Accepted" ? "green" : "red"}>
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
              <Button
                colorScheme="green"
                size="sm"
                onClick={() => onUpdateStatus(request._id, "Accepted")}
              >
                Accept
              </Button>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => onUpdateStatus(request._id, "Rejected")}
              >
                Reject
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>

      {/* Pagination */}
      <HStack justify="center" mt={4}>
        <IconButton
          icon={<ChevronLeftIcon />}
          isDisabled={currentPage === 1}
          onClick={handlePrevPage}
        />
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <IconButton
          icon={<ChevronRightIcon />}
          isDisabled={currentPage === totalPages}
          onClick={handleNextPage}
        />
      </HStack>
    </Box>
  );
};

export default DoctorRequestList;
