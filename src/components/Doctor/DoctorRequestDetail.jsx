import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Text,
    VStack,
    Box,
    Center,
    Spinner,
    Alert,
    AlertIcon,
    Divider,
    Badge,
  } from "@chakra-ui/react";
  import { useGetChildGrowthDataQuery } from "@/services/doctor/doctorApi";
  
  const DoctorRequestDetail = ({ isOpen, onClose, childId }) => {
    // Kiểm tra nếu `childId` hợp lệ trước khi gọi API
    const { data, isLoading, isError } = useGetChildGrowthDataQuery(childId, { skip: !childId });
  
    console.log("Growth Data Response:", data); // Debugging API response
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered> {/* Căn giữa ngang và dọc */}
        <ModalOverlay />
        <ModalContent maxW="900px"> {/* Tăng chiều rộng modal */}
          <ModalHeader>Growth Data Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxH="500px" overflowY="auto"> {/* Thêm thanh cuộn dọc */}
            {isLoading ? (
              <Center py={5}>
                <Spinner size="lg" color="blue.500" />
              </Center>
            ) : isError ? (
              <Alert status="error">
                <AlertIcon />
                Error fetching growth data. Please try again.
              </Alert>
            ) : data?.growthData?.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {data.growthData.map((entry, index) => (
                  <Box
                    key={index}
                    p={5}
                    borderWidth={1}
                    borderRadius="lg"
                    boxShadow="md"
                    bg="white"
                    transition="all 0.3s"
                    _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
                  >
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      {new Date(entry.inputDate).toLocaleDateString()}
                    </Text>
                    <Divider my={2} />
                    <Text><strong>Weight:</strong> {entry.weight} kg</Text>
                    <Text><strong>Height:</strong> {entry.height} cm</Text>
                    <Text><strong>Head Circumference:</strong> {entry.headCircumference || "N/A"} cm</Text>
                    <Text><strong>BMI Level:</strong> <Badge colorScheme="red">{entry.growthResult?.bmi?.level || "N/A"}</Badge></Text>
                    <Text><strong>Height Percentile:</strong> <Badge colorScheme="blue">{entry.growthResult?.height?.percentile || "N/A"}</Badge></Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>No growth data available.</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  
  export default DoctorRequestDetail;