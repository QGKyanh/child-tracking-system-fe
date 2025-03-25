import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Flex,
  useDisclosure,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  CircularProgress,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';
import DoctorRequestList from '@/components/Doctor/DoctorRequestList';
import DoctorRequestDetail from '@/components/Doctor/DoctorRequestDetail';
import { useGetUserInfoQuery } from '@/services/auth/authApi';
import { useGetDoctorRequestsQuery, useUpdateRequestStatusMutation } from '@/services/doctor/doctorApi';

const DoctorRequestPage = () => {
  const { data: userInfo, isLoading: isUserLoading, isError: isUserError } = useGetUserInfoQuery();
  const [doctorId, setDoctorId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ requestId: null, status: "" });
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const cancelRef = useRef();
  const toast = useToast();

  useEffect(() => {
    if (userInfo?._id) {
      console.log("User Info found, setting doctorId:", userInfo._id);
      setDoctorId(userInfo._id);
    }
  }, [userInfo]);

  const { data: requestsData, isLoading: isRequestsLoading, isError, error, refetch } =
    useGetDoctorRequestsQuery({ doctorId, page: currentPage, size: 15 }, { skip: !doctorId });
    const { requests, totalPages } = requestsData || { requests: [], totalPages: 1 };
  // console.log("Doctor ID:", doctorId); 
  console.log("Danh sách requests:", requests);

  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const [selectedChildId, setSelectedChildId] = useState(null);
  const detailModal = useDisclosure();
  const [updateRequestStatus] = useUpdateRequestStatusMutation();

  const handleViewRequest = (requestId) => {
    // Find request object by ID
    const request = requests?.find((req) => req._id === requestId);
  
    if (request) {
      setSelectedRequestId(requestId);
  
      // Handle multiple children: show the first child initially
      if (request.childIds && request.childIds.length > 0) {
        setSelectedChildId(request.childIds[0]); // Assign first childId
      } else {
        setSelectedChildId(null);
      }
  
      detailModal.onOpen();
    } else {
      console.error("Request not found for ID:", requestId);
    }
  };
  
  

  const handleUpdateStatus = (requestId, newStatus) => {
    // Tìm request có requestId tương ứng
    const request = requests?.find((req) => req._id === requestId);
  
    if (!request) {
      console.error("Request not found for ID:", requestId);
      return;
    }
  
    // Chỉ cho phép thay đổi từ "Pending" sang "Accepted" hoặc "Rejected"
    if (request.status === "Pending" && (newStatus === "Accepted" || newStatus === "Rejected")) {
      setConfirmData({ requestId, status: newStatus });
      setIsConfirmOpen(true);
    } else {
      console.warn("Status update not allowed: Can only change from 'Pending' to 'Accepted' or 'Rejected'.");
    }
  };
  
  


  const handleConfirmUpdate = async () => {
    setIsLoading(true); // Start loading
    setIsConfirmOpen(false); // Close modal immediately

    try {
      await updateRequestStatus({
        id: confirmData.requestId,
        status: confirmData.status,
      }).unwrap();

      toast({
        title: `Request has been ${confirmData.status === "Accepted" ? "approved" : "rejected"}.`,
        status: confirmData.status === "Accepted" ? "success" : "warning",
        duration: 1000,
        isClosable: true,
      });

      setTimeout(() => {
        setIsLoading(false); // Stop loading after update
        refetch();
      }, 1000);
    } catch (err) {
      setIsLoading(false); // Stop loading in case of error

      toast({
        title: "Error updating request status.",
        description: err.data?.message || "An error occurred.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  if (isUserLoading) return <p>Loading doctor information...</p>;
  if (isUserError || !doctorId) return <p>Error: Doctor ID not found</p>;

  return (
    <Box>
      {/* Confirmation Dialog */}
      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Status Update
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to {confirmData.status === "Accepted" ? "approve" : "reject"} this request?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button
                colorScheme={confirmData.status === "Accepted" ? "green" : "red"}
                onClick={handleConfirmUpdate}
                ml={3}
                isDisabled={isLoading}
              >
                {isLoading ? <CircularProgress isIndeterminate size="24px" color="white" /> : "Confirm"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Container maxW="container.xl" pt={4} pb={10}>

        {/* Page Header */}
        <Box mb={8}>
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="xl" mb={2}>Doctor Requests</Heading>
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                Manage and review patient requests
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Loading/Error States */}
        {isRequestsLoading ? (
          <Center h="300px">
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </Center>
        ) : isError ? (
          <Alert status="error">
            <AlertIcon />
            Error loading requests: {error?.data?.message || "Unknown error"}
          </Alert>
        ) : requests.length === 0 ? (
          <Center h="200px">
            <Text fontSize="lg" color="gray.500">No requests found for this doctor.</Text>
          </Center>
        ) : (
          <DoctorRequestList
          requests={requests}
          totalPages={totalPages}
          currentPage={currentPage}
          setPage={setCurrentPage}
          onView={handleViewRequest}
          onUpdateStatus={handleUpdateStatus}
        />
        )}

        {/* Modals */}
        <DoctorRequestDetail
          isOpen={detailModal.isOpen}
          onClose={detailModal.onClose}
          childId={selectedChildId}
        />
      </Container>
    </Box>
  );
};

export default DoctorRequestPage;
