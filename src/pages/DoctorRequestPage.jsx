import { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';
import DoctorRequestList from '@/components/Doctor/DoctorRequestList';
import DoctorRequestDetail from '@/components/Doctor/DoctorRequestDetail';
import { useGetUserInfoQuery } from '@/services/auth/authApi';
import { useGetDoctorRequestsQuery, useUpdateRequestStatusMutation } from '@/services/doctor/doctorApi';

const DoctorRequestPage = () => {
  // Lấy thông tin bác sĩ
  const { data: userInfo, isLoading: isUserLoading, isError: isUserError } = useGetUserInfoQuery();
  const [doctorId, setDoctorId] = useState(null);

  // Cập nhật doctorId khi userInfo có giá trị
  useEffect(() => {
    if (userInfo?._id) {
      setDoctorId(userInfo._id);
    }
  }, [userInfo]);
  console.log(doctorId);

  // Fetch danh sách requests của bác sĩ
  const { data: requests, isLoading: isRequestsLoading, isError, error, refetch } =
    useGetDoctorRequestsQuery(doctorId, { skip: !doctorId });

  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const detailModal = useDisclosure();
  const [updateRequestStatus] = useUpdateRequestStatusMutation();

  const handleViewRequest = (requestId) => {
    setSelectedRequestId(requestId);
    detailModal.onOpen();
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      await updateRequestStatus({ id: requestId, status }).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to update request status:', err);
    }
  };

  // Debug logs để kiểm tra dữ liệu
  console.log("Doctor ID:", doctorId);
  console.log("Requests:", requests?.requests);

  if (isUserLoading) return <p>Loading doctor information...</p>;
  if (isUserError || !doctorId) return <p>Error: Doctor ID not found</p>;

  return (
    <Box>
      <Container maxW='container.xl' pt={4} pb={10}>
        {/* Breadcrumb */}
        <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />} mb={6}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to='/'>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Doctor Requests</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Page Header */}
        <Box mb={8}>
          <Flex justify='space-between' align='center'>
            <Box>
              <Heading size='xl' mb={2}>Doctor Requests</Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')}>
                Manage and review patient requests
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Loading/Error States */}
        {isRequestsLoading ? (
          <Center h='300px'>
            <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
          </Center>
        ) : isError ? (
          <Alert status='error'>
            <AlertIcon />
            Error loading requests: {error?.data?.message || 'Unknown error'}
          </Alert>
        ) : requests.length === 0 ? (
          <Center h='200px'>
            <Text fontSize="lg" color="gray.500">No requests found for this doctor.</Text>
          </Center>
        ) : (
          /* Doctor Requests List Component */
          <DoctorRequestList
            requests={requests}
            onView={handleViewRequest}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {/* Modals */}
        <DoctorRequestDetail
          isOpen={detailModal.isOpen}
          onClose={detailModal.onClose}
          requestId={selectedRequestId}
        />
      </Container>
    </Box>
  );
};

export default DoctorRequestPage;
