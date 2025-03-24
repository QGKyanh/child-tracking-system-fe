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
  Flex,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const DoctorRequestList = ({ requests, onView, onUpdateStatus }) => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate(); // ✅ Khởi tạo navigate

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const displayedRequests = requests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!requests.length) return <Text>No requests available.</Text>;

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {displayedRequests.map((request) => {
          const isPending = request.status === "Pending";
          const childId = request.childIds?.[0]; // Lấy ID đứa trẻ từ request

          return (
            <Box
              key={request._id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              boxShadow="lg"
              transition="all 0.3s"
              _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
            >
              {/* Top Section */}
              <Flex justify="space-between" align="flex-start" mb={2}>
                <HStack spacing={4}>
                  <Avatar src={request.member.avatar || "/default-avatar.png"} />
                  <Box>
                    <Text fontWeight="bold">{request.member.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </Text>
                  </Box>
                </HStack>
                <Badge
                  colorScheme={
                    request.status === "Accepted"
                      ? "green"
                      : request.status === "Rejected"
                      ? "red"
                      : "yellow"
                  }
                >
                  {request.status}
                </Badge>
              </Flex>

              {/* Message */}
              <Text mt={2} mb={3}>{request.title}</Text>

              <Divider />

              {/* Bottom Actions */}
              <Flex justify="space-between" align="center" mt={3}>
                {/* 👇 Bottom left - View child */}
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  onClick={() => navigate(`/children/${request.childIds?.[0]}`)}
                  isDisabled={!childId}
                >
                  View Child
                </Button>

                {/* 👇 Bottom right - Actions */}
                <HStack spacing={2}>
                  <Button colorScheme="blue" size="sm" onClick={() => onView(request._id)}>
                    View Details
                  </Button>

                  {isPending && (
                    <>
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
          <Button
            key={index}
            size="sm"
            variant={currentPage === index + 1 ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

export default DoctorRequestList;



