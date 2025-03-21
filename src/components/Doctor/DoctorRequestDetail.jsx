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
  } from '@chakra-ui/react';
  import { useGetChildGrowthDataQuery } from '@/services/doctor/doctorApi';
  
  const DoctorRequestDetail = ({ isOpen, onClose, requestId }) => {
    const { data: growthData, isLoading } = useGetChildGrowthDataQuery(requestId, { skip: !requestId });
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Text>Loading...</Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {growthData ? (
                  <>
                    <Text fontWeight="bold">Growth Data:</Text>
                    {growthData.map((entry, index) => (
                      <Box key={index} p={2} borderWidth={1} borderRadius="md">
                        <Text><strong>Period:</strong> {entry.period}</Text>
                        <Text><strong>Weight:</strong> {entry.weight.description}</Text>
                        <Text><strong>Height:</strong> {entry.height.description}</Text>
                        <Text><strong>Head Circumference:</strong> {entry.headCircumference.description}</Text>
                      </Box>
                    ))}
                  </>
                ) : (
                  <Text>No growth data available.</Text>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };
  
  export default DoctorRequestDetail;
  