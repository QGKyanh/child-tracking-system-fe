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
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectCurrentUser } from '@/services/auth/authSlice';
import { useGetConsultationsByUserIdQuery } from '@/services/consultations/consultationsApi';
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

const ConsultationPage = () => {
  const user = useSelector(selectCurrentUser);
  const doctorId = user?._id;
  const role = user?.role;
  const as = role === 2 ? 'DOCTOR' : 'MEMBER';
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
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
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    return `${years}y ${months < 0 ? months + 12 : months}m`;
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

      {isLoading ? (
        <Flex justify='center' align='center' h='60vh'>
          <Spinner size='xl' />
        </Flex>
      ) : (
        <VStack spacing={4}>
          {consultations
            .filter((item, index) => {
              const title = item?.requestDetails?.title?.toLowerCase() || '';
              const parent =
                item?.requestDetails?.member?.name?.toLowerCase() || '';
              const child =
                item?.requestDetails?.children?.[0]?.name?.toLowerCase() || '';
              const term = searchTerm.toLowerCase();
              const doctorName = item?.doctor?.name?.toLowerCase() || '';
              console.log('consultations:', consultations);
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
                <Flex justify='space-between' align='flex-start' mb={2}>
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
                      <>
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
                        <Button
                          size='sm'
                          colorScheme='red'
                          variant='outline'
                          mt={2}
                          isLoading={isUpdating}
                          onClick={() => {
                            console.log(item._id);
                            console.log(typeof item._id);
                            handleEndConsultation(item._id);
                          }}
                        >
                          End Consultation
                        </Button>
                      </>
                    )}
                    {item.status === 'Ended' && (
                      <Text>This consultation has ended</Text>
                    )}
                  </Box>

                  <VStack align='flex-end' spacing={2}>
                    {role !== 2 && item?.requestDetails?.doctor && (
                      <VStack spacing={1} align='center' mt={4}>
                        <Avatar
                          size='sm'
                          name={item.requestDetails.doctor.name}
                          src={item.requestDetails.doctor.avatar}
                        />
                        <Text fontSize='sm' color='gray.600' textAlign='center'>
                          Doctor: {item.requestDetails?.doctor.name}
                        </Text>
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
    </Flex>
  );
};

export default ConsultationPage;
