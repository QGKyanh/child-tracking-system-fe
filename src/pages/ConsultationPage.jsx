import {
  Box,
  Flex,
  VStack,
  Text,
  Avatar,
  HStack,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spinner,
  useColorModeValue,
  SimpleGrid,
  Heading,
  Badge,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectCurrentUser } from '@/services/auth/authSlice';
import { useGetConsultationsByUserIdQuery } from '@/services/consultations/consultationsApi';
import { useGetGrowthDataQuery } from '@/services/child/childApi';
import GrowthChart from '@/components/Child/ChildGrowth/GrowthChart';
import PercentileDisplay from '@/components/Child/ChildGrowth/PercentileDisplay'; // Import PercentileDisplay component
import GrowthDataForm from '@/components/Child/ChildGrowth/GrowthDataForm';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useUpdateConsultationStatusMutation } from '@/services/consultation/consultationApi';
import ConsultationRatingModal from '@/components/Consultation/ConsultationRatingModal';

const ConsultationPage = () => {
  const user = useSelector(selectCurrentUser);
  const doctorId = user?._id;
  const role = user?.role;
  const as = role === 2 ? 'DOCTOR' : 'MEMBER';
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const toast = useToast();
  const rateModal = useDisclosure();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All');

  const [updateConsultationStatus, { isLoading: isUpdating }] =
    useUpdateConsultationStatusMutation();
  const { data, isLoading, isError, error, refetch } =
    useGetConsultationsByUserIdQuery({
      userId: doctorId,
      page,
      size: 10,
      order: 'descending',
      sortBy: 'date',
      as,
    });
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const consultations = data?.consultations || [];
  const { data: growthData, isLoading: growthDataLoading } =
    useGetGrowthDataQuery(
      selectedConsultation?.requestDetails?.children[0]?._id || ''
    );
  console.log('con la:', consultations);

  const handleOpen = consultation => {
    const growthVelocity =
      consultation?.requestDetails?.children?.[0]?.growthVelocityResult || [];

    const growthChartData = growthVelocity.map(result => {
      return {
        age: result.period,
        weight: result.weight.weightVelocity ?? 0,
        height: result.height.heightVelocity ?? 0,
        bmi: (
          (result.weight.weightVelocity ?? 0) /
          ((result.height.heightVelocity ?? 1) / 100) ** 2
        ).toFixed(1),
      };
    });

    const clonedConsultation = {
      ...consultation,
      requestDetails: {
        ...consultation.requestDetails,
        children: [
          {
            ...consultation.requestDetails.children[0],
            growthChartData,
          },
        ],
      },
    };

    setSelectedConsultation(clonedConsultation);
    onOpen();
  };

  const handleEndConsultation = async consultationId => {
    try {
      await updateConsultationStatus({
        id: consultationId.toString(), // Pass correct string ID
        status: 'Ended',
      }).unwrap();
      await refetch();
      toast({
        title: 'Success',
        description: 'Consultation ended successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error?.data?.message || 'Failed to end consultation.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = date => new Date(date).toLocaleString('en-US');

  const calculateAge = birthDate => {
    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return `${years}y ${months}m ${days}d`;
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Ongoing':
        return 'green';
      case 'Ended':
        return 'red';
      case 'Pending':
        return 'yellow';
      case 'Rejected':
        return 'red';
      default:
        return 'blue';
    }
  };
  return (
    <Flex
      direction='column'
      minH='100vh'
      p={4}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Text fontSize='2xl' fontWeight='bold' color='blue.600' mb={4}>
        Consultation Requests
      </Text>
      <Box mb={4}>
        <input
          type='text'
          placeholder='Search by Title, Parent, or Child...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
      </Box>
      <Flex gap={4} mb={4} direction={{ base: 'column', md: 'row' }}>


  <Box>
    <select
      value={statusFilter}
      onChange={e => setStatusFilter(e.target.value)}
      style={{
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
      }}
    >
      <option value='All'>All</option>
      <option value='Ongoing'>Ongoing</option>
      <option value='Ended'>Ended</option>
    </select>
  </Box>
</Flex>

      {isLoading ? (
        <Flex justify='center' align='center' h='60vh'>
          <Spinner size='xl' />
        </Flex>
      ) : (
        <VStack spacing={4}>
          {consultations
       .filter(item => {
        const title = item?.requestDetails?.title?.toLowerCase() || '';
        const parent = item?.requestDetails?.member?.name?.toLowerCase() || '';
        const child = item?.requestDetails?.children?.[0]?.name?.toLowerCase() || '';
        const term = searchTerm.toLowerCase();
        const doctorName = item?.doctor?.name?.toLowerCase() || '';
      
        const matchesSearch =
          title.includes(term) ||
          parent.includes(term) ||
          child.includes(term) ||
          doctorName.includes(term);
      
        const matchesStatus =
          statusFilter === 'All' || item.status === statusFilter;
      
        return matchesSearch && matchesStatus;
      })
      
            .map((item, index) => (
              <Box
                key={item._id}
                bg='white'
                boxShadow='md'
                borderRadius='md'
                p={4}
                w='100%'
                maxW='4xl'
                _hover={{ boxShadow: 'lg' }}
              >
                <Flex justify='space-between' align='flex-start' mb={2}>
                  <Box>
                    <Text fontWeight='bold'>
                      {index + 1}.{' '}
                      {item.requestDetails.title || 'Consultation Request'} -{' '}
                      <Badge colorScheme={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </Text>

                    <Text fontSize='sm' color='gray.600'>
                      Submitted: {formatDate(item.createdAt)}
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      Parent: {item.requestDetails.member.name}
                    </Text>

                    {item.requestDetails.children?.map((child, index) => (
                      <Text key={child._id} fontSize='sm' color='gray.600'>
                        Child {index + 1}: {child.name} - Age:{' '}
                        {calculateAge(child.birthDate)}
                      </Text>
                    ))}

                    {item.status === 'Ongoing' && (
                      <Box display={'flex'} gap={2}>
                        <Button
                          size='sm'
                          colorScheme='teal'
                          variant='outline'
                          mt={2}
                          onClick={() => {
                            navigate(`/consultation-chat/${item._id}`, {
                              state: {
                                index: index + 1,
                                page: 1,
                                size: 100,
                              },
                            });
                          }}
                        >
                          Message
                        </Button>
                        {role !== 2 && (
                          <Button
                            size='sm'
                            colorScheme='red'
                            variant='outline'
                            mt={2}
                            isLoading={isUpdating}
                            onClick={() => {
                              handleEndConsultation(item._id);
                            }}
                          >
                            End Consultation
                          </Button>
                        )}
                      </Box>
                    )}
                    {item.status === 'Ended' && (
                      <Text fontWeight={700} color={'red'} pt={2}>
                        This consultation has ended
                      </Text>
                    )}
                  </Box>

                  <VStack align='flex-end' spacing={2}>
                    {role !== 2 && item?.requestDetails?.doctor && (
                      <VStack
                        spacing={1}
                        align='center'
                        mt={4}
                        display={'flex'}
                        flexDirection={'column'}
                        gap={4}
                      >
                        <Box
                          display={'flex'}
                          flexDirection={'column'}
                          justifyContent={'center'}
                          alignItems={'center'}
                        >
                          <Avatar
                            size='sm'
                            name={item.requestDetails.doctor.name}
                            src={item.requestDetails.doctor.avatar}
                          />
                          <Text
                            fontSize='sm'
                            color='gray.600'
                            textAlign='center'
                          >
                            Doctor: {item.requestDetails?.doctor.name}
                          </Text>
                        </Box>

                        {item.rating === 0 && (
                          <Button
                            size='sm'
                            colorScheme='yellow'
                            variant='outline'
                            onClick={() => {
                              setSelectedConsultationId(item._id); // Store the correct ID
                              rateModal.onOpen();
                            }}
                            disabled={item.status === 'Ongoing'}
                          >
                            Rate consultation
                          </Button>
                        )}
                        {item.rating !== 0 && (
                          <Button
                            disabled
                            size='sm'
                            colorScheme='green'
                            variant='outline'
                          >
                            Rating successfully
                          </Button>
                        )}
                      </VStack>
                    )}
                    {role === 2 && (
                      <Button
                        size='sm'
                        colorScheme='blue'
                        onClick={() => handleOpen(item)}
                      >
                        View
                      </Button>
                    )}
                  </VStack>
                </Flex>
              </Box>
            ))}
        </VStack>
      )}

      <Flex justify='center' mt={4}>
        <HStack spacing={4}>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              size='sm'
              colorScheme='blue'
              variant={page === index + 1 ? 'solid' : 'outline'}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </HStack>
      </Flex>

      {selectedConsultationId && (
        <ConsultationRatingModal
          isOpen={rateModal.isOpen}
          onClose={async () => {
            rateModal.onClose();
            await refetch();
            setSelectedConsultationId(null); // Clear selection
          }}
          consultationId={selectedConsultationId} // Use stored ID
        />
      )}

      {/* Modal Detail */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size='6xl'
        scrollBehavior='inside'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color='blue.600'>Consultation Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedConsultation && (
              <VStack spacing={10} align='stretch'>
                {/* GrowthChart Integration */}
                <GrowthChart
                  growthData={growthData?.growthData}
                  childGender={
                    selectedConsultation?.requestDetails?.children[0]?.gender
                  }
                  birthDate={
                    selectedConsultation?.requestDetails?.children[0]?.birthDate
                  }
                />

                {/* PercentileDisplay Integration */}
                <PercentileDisplay
                  childData={selectedConsultation?.requestDetails?.children[0]}
                  latestGrowthData={
                    growthData?.growthData?.[growthData?.growthData.length - 1]
                  }
                />

                {/* Show a button for second child if there is one */}
                {selectedConsultation?.requestDetails?.children?.length > 1 && (
                  <Button
                    size='sm'
                    colorScheme='blue'
                    onClick={() => {
                      // Update selectedConsultation state to show the second child's growth data
                      const secondChildId =
                        selectedConsultation?.requestDetails?.children[1]?._id;
                      setSelectedConsultation({
                        ...selectedConsultation,
                        requestDetails: {
                          ...selectedConsultation.requestDetails,
                          children: [
                            selectedConsultation.requestDetails.children[1],
                          ],
                        },
                      });
                      onOpen(); // Open the modal again to show the second child's data
                    }}
                  >
                    View Growth Data for Second Child
                  </Button>
                )}

                {/* Recent Measurements Box */}
                <Box
                  mt={6}
                  p={4}
                  borderWidth='1px'
                  borderRadius='lg'
                  bg='white'
                  shadow='sm'
                >
                  <Heading size='md' mb={4}>
                    Recent Measurements
                  </Heading>

                  {growthData?.growthData?.slice(0, 5).map(measurement => (
                    <Box
                      key={measurement._id}
                      p={3}
                      mb={2}
                      borderWidth='1px'
                      borderRadius='md'
                      _hover={{ bg: 'gray.50' }}
                    >
                      <Flex justify='space-between' align='center'>
                        <VStack align='start' spacing={1}>
                          <Badge>{formatDate(measurement.inputDate)}</Badge>
                          <HStack spacing={4} mt={1}>
                            <Text fontSize='sm'>
                              Height: {measurement.height} cm
                            </Text>
                            <Text fontSize='sm'>
                              Weight: {measurement.weight} kg
                            </Text>
                          </HStack>
                          {measurement.headCircumference && (
                            <Text fontSize='sm'>
                              Head: {measurement.headCircumference} cm
                            </Text>
                          )}
                          {/* Add indicator for growth status */}
                          {measurement.growthResult && (
                            <HStack mt={1}>
                              {measurement.growthResult.weight && (
                                <Badge
                                  colorScheme={
                                    measurement.growthResult.weight.level ===
                                    'High'
                                      ? 'blue'
                                      : measurement.growthResult.weight
                                            .level === 'Low'
                                        ? 'orange'
                                        : measurement.growthResult.weight
                                              .level === 'Average'
                                          ? 'green'
                                          : measurement.growthResult.weight
                                                .level === 'Obese'
                                            ? 'red'
                                            : 'gray'
                                  }
                                  size='sm'
                                >
                                  {measurement.growthResult.weight.level}
                                </Badge>
                              )}
                            </HStack>
                          )}
                        </VStack>
                      </Flex>
                    </Box>
                  ))}

                  {growthData?.growthData?.length > 5 && (
                    <Text
                      fontSize='sm'
                      color='gray.500'
                      textAlign='center'
                      mt={2}
                    >
                      Showing 5 of {growthData?.growthData?.length} measurements
                    </Text>
                  )}
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default ConsultationPage;