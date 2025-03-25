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
<<<<<<< HEAD
  Heading,
  Badge,
=======
  Stack,
  useToast,
>>>>>>> 247b6f8dd90434cfe50cbed3f0d2643adcf1b853
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectCurrentUser } from '@/services/auth/authSlice';
import { useGetConsultationsByUserIdQuery } from '@/services/consultations/consultationsApi';
<<<<<<< HEAD
import { useGetGrowthDataQuery } from '@/services/child/childApi';
import GrowthChart from '@/components/Child/ChildGrowth/GrowthChart';  
import PercentileDisplay from '@/components/Child/ChildGrowth/PercentileDisplay';  // Import PercentileDisplay component
import GrowthDataForm from '@/components/Child/ChildGrowth/GrowthDataForm';
=======
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

>>>>>>> 247b6f8dd90434cfe50cbed3f0d2643adcf1b853
const ConsultationPage = () => {
  const user = useSelector(selectCurrentUser);
  const doctorId = user?._id;
  const role = user?.role;
  const as = role === 2 ? 'DOCTOR' : 'MEMBER';
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
<<<<<<< HEAD
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const { data, isLoading } = useGetConsultationsByUserIdQuery({
    userId: doctorId,
    page,
    size: 8,
    order: 'descending',
    sortBy: 'date',
    as,
  });

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const consultations = data?.consultations || [];
  const { data: growthData, isLoading: growthDataLoading } = useGetGrowthDataQuery(
    selectedConsultation?.requestDetails?.children[0]?._id || ''
  );
console.log("con la:",consultations);
  const handleOpen = (consultation) => {
    setSelectedConsultation(consultation);
    onOpen();
  };

  const formatDate = (date) => new Date(date).toLocaleString('en-US');

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    return `${years}y ${months < 0 ? months + 12 : months}m`;
  };
  const getStatusColor = (status) => {
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
    <Flex direction="column" minH="100vh" p={4} bg={useColorModeValue('gray.50', 'gray.800')}>
      <Text fontSize="2xl" fontWeight="bold" color="blue.600" mb={4}>
=======
  const toast = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [updateConsultationStatus, { isLoading: isUpdating }] =
    useUpdateConsultationStatusMutation();
  const { data, isLoading, isError, error, refetch } =
    useGetConsultationsByUserIdQuery({
      userId: doctorId,
      page,
      size: 8,
      as,
    });

  const consultations = data?.consultations || [];
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

  return (
    <Flex
      direction='column'
      minH='100vh'
      p={4}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Text fontSize='2xl' fontWeight='bold' color='blue.600' mb={4}>
>>>>>>> 247b6f8dd90434cfe50cbed3f0d2643adcf1b853
        Consultation Requests
      </Text>
      <Box mb={4}>
        <input
<<<<<<< HEAD
          type="text"
          placeholder="Search by Title, Parent, or Child..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
=======
          type='text'
          placeholder='Search by Title, Parent, or Child...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
>>>>>>> 247b6f8dd90434cfe50cbed3f0d2643adcf1b853
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
      </Box>

      {isLoading ? (
<<<<<<< HEAD
        <Flex justify="center" align="center" h="60vh">
          <Spinner size="xl" />
=======
        <Flex justify='center' align='center' h='60vh'>
          <Spinner size='xl' />
>>>>>>> 247b6f8dd90434cfe50cbed3f0d2643adcf1b853
        </Flex>
      ) : (
        <VStack spacing={4}>
          {consultations
<<<<<<< HEAD
            .filter((item) => {
              const title = item?.requestDetails?.title?.toLowerCase() || '';
              const parent = item?.requestDetails?.member?.name?.toLowerCase() || '';
              const child = item?.requestDetails?.children?.[0]?.name?.toLowerCase() || '';
=======
            .filter((item, index) => {
              const title = item?.requestDetails?.title?.toLowerCase() || '';
              const parent =
                item?.requestDetails?.member?.name?.toLowerCase() || '';
              const child =
                item?.requestDetails?.children?.[0]?.name?.toLowerCase() || '';
>>>>>>> 247b6f8dd90434cfe50cbed3f0d2643adcf1b853
              const term = searchTerm.toLowerCase();
              const doctorName = item?.doctor?.name?.toLowerCase() || '';
              return (
                title.includes(term) ||
                parent.includes(term) ||
                child.includes(term) ||
                doctorName.includes(term)
              );
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
<<<<<<< HEAD
                <Flex justify="space-between" align="flex-start" mb={2}>
                  <Box>
                    
                    <Text fontWeight="bold">
                      {index + 1}. {item.requestDetails.title || 'Consultation Request'}             -            <Badge colorScheme={getStatusColor(item.status)}>{item.status}</Badge>

                    </Text>
                    
                    <Text fontSize="sm" color="gray.600">
                      Submitted: {formatDate(item.createdAt)}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Parent: {item.requestDetails.member.name}
                    </Text>

                    {item.requestDetails.children?.map((child, index) => (
  <Text key={child._id} fontSize="sm" color="gray.600">
    Child {index + 1}: {child.name} - Age: {calculateAge(child.birthDate)}
  </Text>
))}


                    <Button
                      size="sm"
                      colorScheme="teal"
                      variant="outline"
                      mt={2}
                      onClick={() => navigate(`/consultation-chat/${item._id}`, { state: { index: index + 1 } })}
                    >
                      Message
                    </Button>
                  </Box>

                  <VStack align="flex-end" spacing={2}>
                    {role !== 2 && item?.requestDetails?.doctor && (
                      <VStack spacing={1} align="center" mt={4}>
                        <Avatar size="sm" name={item.requestDetails.doctor.name} src={item.requestDetails.doctor.avatar} />
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          Doctor: {item.requestDetails?.doctor.name}
                        </Text>
                      </VStack>
                    )}
                    {role === 2 && (
                      <Button size="sm" colorScheme="blue" onClick={() => handleOpen(item)}>
                        View
                      </Button>
                      
                    )}
                    
=======
                <Flex justify='space-between' align='flex-start'>
                  <Box>
                    <Text fontWeight='bold'>
                      {index + 1}.{' '}
                      {item.requestDetails.title || 'Consultation Request'}
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      Submitted: {formatDate(item.createdAt)}
                    </Text>
                    <Text fontSize='sm' color='gray.600'>
                      Parent: {item.requestDetails.member.name}
                    </Text>

                    {item.requestDetails.children?.[0]?.birthDate && (
                      <Text fontSize='sm' color='gray.600'>
                        Child: {item.requestDetails.children[0].name} - Age:{' '}
                        {calculateAge(
                          item.requestDetails.children[0].birthDate
                        )}
                      </Text>
                    )}

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

                        <Button
                          size='sm'
                          colorScheme='yellow'
                          variant='outline'
                          onClick={() => handleOpen(item)}
                          disabled={item.status === 'Ongoing' ? true : false}
                        >
                          Rate consultation
                        </Button>
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
>>>>>>> 247b6f8dd90434cfe50cbed3f0d2643adcf1b853
                  </VStack>
                </Flex>
              </Box>
            ))}
        </VStack>
      )}

<<<<<<< HEAD
      <Flex justify="center" mt={4}>
        <HStack spacing={4}>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              size="sm"
              colorScheme="blue"
              variant={page === index + 1 ? 'solid' : 'outline'}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </HStack>
      </Flex>

      {/* Modal Detail */}
  {/* Modal Detail */}
<Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
  <ModalOverlay />
  <ModalContent>
    <ModalHeader color="blue.600">Consultation Detail</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {selectedConsultation && (
        <VStack spacing={10} align="stretch">
          {/* GrowthChart Integration */}
          <GrowthChart
            growthData={growthData?.growthData}
            childGender={selectedConsultation?.requestDetails?.children[0]?.gender}
            birthDate={selectedConsultation?.requestDetails?.children[0]?.birthDate}
          />

          {/* PercentileDisplay Integration */}
          <PercentileDisplay
            childData={selectedConsultation?.requestDetails?.children[0]}
            latestGrowthData={growthData?.growthData?.[growthData?.growthData.length - 1]}
          />

          {/* Show a button for second child if there is one */}
          {selectedConsultation?.requestDetails?.children?.length > 1 && (
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => {
                // Update selectedConsultation state to show the second child's growth data
                const secondChildId = selectedConsultation?.requestDetails?.children[1]?._id;
                setSelectedConsultation({
                  ...selectedConsultation,
                  requestDetails: {
                    ...selectedConsultation.requestDetails,
                    children: [selectedConsultation.requestDetails.children[1]],
                  },
                });
                onOpen();  // Open the modal again to show the second child's data
              }}
            >
              View Growth Data for Second Child
            </Button>
          )}

          {/* Recent Measurements Box */}
          <Box mt={6} p={4} borderWidth="1px" borderRadius="lg" bg="white" shadow="sm">
            <Heading size="md" mb={4}>
              Recent Measurements
            </Heading>

            {growthData?.growthData?.slice(0, 5).map((measurement) => (
              <Box
                key={measurement._id}
                p={3}
                mb={2}
                borderWidth="1px"
                borderRadius="md"
                _hover={{ bg: 'gray.50' }}
              >
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Badge>{formatDate(measurement.inputDate)}</Badge>
                    <HStack spacing={4} mt={1}>
                      <Text fontSize="sm">Height: {measurement.height} cm</Text>
                      <Text fontSize="sm">Weight: {measurement.weight} kg</Text>
                    </HStack>
                    {measurement.headCircumference && (
                      <Text fontSize="sm">Head: {measurement.headCircumference} cm</Text>
                    )}
                    {/* Add indicator for growth status */}
                    {measurement.growthResult && (
                      <HStack mt={1}>
                        {measurement.growthResult.weight && (
                          <Badge
                            colorScheme={
                              measurement.growthResult.weight.level === 'High'
                                ? 'blue'
                                : measurement.growthResult.weight.level === 'Low'
                                ? 'orange'
                                : measurement.growthResult.weight.level === 'Average'
                                ? 'green'
                                : measurement.growthResult.weight.level === 'Obese'
                                ? 'red'
                                : 'gray'
                            }
                            size="sm"
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
              <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
                Showing 5 of {growthData?.growthData?.length} measurements
              </Text>
            )}
          </Box>
        </VStack>
      )}
    </ModalBody>
  </ModalContent>
</Modal>

=======
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
                <Box bg='white' p={6} borderRadius='md' boxShadow='md'>
                  <Text
                    fontWeight='bold'
                    fontSize='lg'
                    mb={4}
                    textAlign='center'
                  >
                    Growth Chart
                  </Text>
                  <ResponsiveContainer width='100%' height={300}>
                    <LineChart
                      data={
                        selectedConsultation.requestDetails.children[0]
                          .growthChartData
                      }
                    >
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='age' />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type='monotone'
                        dataKey='weight'
                        name='Weight (kg)'
                        stroke='#3182CE'
                      />
                      <Line
                        type='monotone'
                        dataKey='height'
                        name='Height (cm)'
                        stroke='#38A169'
                      />
                      <Line
                        type='monotone'
                        dataKey='bmi'
                        name='BMI'
                        stroke='#ED8936'
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>

                <Box bg='white' p={6} borderRadius='md' boxShadow='md'>
                  <Text
                    fontWeight='bold'
                    fontSize='lg'
                    mb={4}
                    textAlign='center'
                  >
                    Growth Data Table
                  </Text>
                  <Box overflowX='auto'>
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <thead style={{ backgroundColor: '#f0f4f8' }}>
                        <tr>
                          <th style={{ padding: '12px', textAlign: 'center' }}>
                            Age
                          </th>
                          <th style={{ padding: '12px', textAlign: 'center' }}>
                            Weight (kg)
                          </th>
                          <th style={{ padding: '12px', textAlign: 'center' }}>
                            Height (cm)
                          </th>
                          <th style={{ padding: '12px', textAlign: 'center' }}>
                            BMI
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedConsultation.requestDetails.children[0].growthChartData.map(
                          (row, idx) => (
                            <tr
                              key={idx}
                              style={{ borderBottom: '1px solid #eee' }}
                            >
                              <td
                                style={{ padding: '12px', textAlign: 'center' }}
                              >
                                {row.age}
                              </td>
                              <td
                                style={{ padding: '12px', textAlign: 'center' }}
                              >
                                {row.weight}
                              </td>
                              <td
                                style={{ padding: '12px', textAlign: 'center' }}
                              >
                                {row.height}
                              </td>
                              <td
                                style={{ padding: '12px', textAlign: 'center' }}
                              >
                                {row.bmi}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </Box>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
>>>>>>> 247b6f8dd90434cfe50cbed3f0d2643adcf1b853
    </Flex>
  );
};

export default ConsultationPage;
