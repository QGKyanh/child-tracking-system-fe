import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  useGetScheduleByUserIdQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation 
} from '@/services/doctor/doctorApi';
import {
  Box,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  VStack,
  Spinner,
  Center,
  Text
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/services/auth/authSlice';

const localizer = momentLocalizer(moment);

const DoctorSchedulePage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('week'); // Add state for current view
  const toast = useToast();
  const user = useSelector(selectCurrentUser);
  const doctorId = user?._id;

  const { 
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useGetScheduleByUserIdQuery(doctorId, { skip: !doctorId });

  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();

  const events = useMemo(() => {
    return data?.schedules?.map(schedule => ({
      id: schedule._id,
      title: schedule.status?.charAt(0)?.toUpperCase() + schedule.status?.slice(1) || "Available",
      start: new Date(schedule.startTime),
      end: new Date(schedule.endTime),
      resource: schedule,
    })) || [];
  }, [data?.schedules]);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setModalVisible(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedSlot({
      id: event.id,
      startTime: event.start,
      endTime: event.end,
      status: event.resource.status,
      doctorId: event.resource.doctorId,
    });
    setModalVisible(true);
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  // Handle view change
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    try {
      const scheduleData = {
        doctorId,
        status: values.status,
      };
      const originalStartTime = selectedSlot?.startTime 
        ? moment(selectedSlot.startTime).format('MM/DD/YYYY HH:mm')
        : selectedSlot?.start 
          ? moment(selectedSlot.start).format('MM/DD/YYYY HH:mm')
          : null;
      if (values.startTime && values.startTime !== originalStartTime) {
        scheduleData.startTime = values.startTime;
      }
      const originalEndTime = selectedSlot?.endTime 
        ? moment(selectedSlot.endTime).format('MM/DD/YYYY HH:mm')
        : selectedSlot?.end 
          ? moment(selectedSlot.end).format('MM/DD/YYYY HH:mm')
          : null;
      if (values.endTime && values.endTime !== originalEndTime) {
        scheduleData.endTime = values.endTime;
      }

      if (selectedSlot?.id) {
        await updateSchedule({ _id: selectedSlot.id, ...scheduleData }).unwrap();
        toast({
          title: 'Success',
          description: 'Schedule updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        scheduleData.startTime = values.startTime;
        scheduleData.endTime = values.endTime;
        await createSchedule(scheduleData).unwrap();
        toast({
          title: 'Success',
          description: 'Schedule created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      setModalVisible(false);
      refetch();
    } catch (error) {
      console.log('Error:', error);
      const validationErrors = error?.data?.validationErrors || [];
      let errorDescription = 'Operation failed';
      if (validationErrors.length > 0) {
        errorDescription = validationErrors
          .map(err => ` ${err.error}`)
          .join(', ');
      } else if (error?.data?.message) {
        errorDescription = error.data.message;
      }
      toast({
        title: 'Error',
        description: errorDescription,
        status: 'error',
        duration: 5000, 
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    if (selectedSlot?.id) {
      try {
        await deleteSchedule(selectedSlot.id).unwrap();
        toast({
          title: 'Success',
          description: 'Schedule deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setModalVisible(false);
        refetch();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Delete failed',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.resource.status) {
      case 'available':
        backgroundColor = '#3182ce';
        break;
      case 'booked':
        backgroundColor = '#e53e3e';
        break;
      case 'completed':
        backgroundColor = '#38a169';
        break;
      case 'cancelled':
        backgroundColor = '#718096';
        break;
      default:
        backgroundColor = '#3182ce';
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  if (isLoading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Text>Loading schedules...</Text>
        </VStack>
      </Center>
    );
  }

  if (isError) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Text color="red.500">
            Error loading schedules: {error?.data?.message || error?.message || 'Unknown error'}
          </Text>
          <Button colorScheme="blue" onClick={refetch}>
            Retry
          </Button>
        </VStack>
      </Center>
    );
  }

  if (!doctorId) {
    return (
      <Center h="100vh">
        <Text>Please log in to view and manage your schedules.</Text>
      </Center>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={6}>Doctor Schedule Management</Heading>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        step={45}
        timeslots={1}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        defaultView="week"
        views={['month', 'week', 'day']}
        date={currentDate}
        onNavigate={handleNavigate}
        view={currentView}          
        onView={handleViewChange}   
      />

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedSlot?.id ? 'Edit Schedule' : 'Create New Schedule'}
          </ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    name="startTime"
                    defaultValue={
                      selectedSlot?.startTime 
                        ? moment(selectedSlot.startTime).format('MM/DD/YYYY HH:mm')
                        : selectedSlot?.start 
                          ? moment(selectedSlot.start).format('MM/DD/YYYY HH:mm')
                          : ''
                    }
                    placeholder="MM/DD/YYYY HH:mm"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>End Time</FormLabel>
                  <Input
                    name="endTime"
                    defaultValue={
                      selectedSlot?.endTime 
                        ? moment(selectedSlot.endTime).format('MM/DD/YYYY HH:mm')
                        : selectedSlot?.end 
                          ? moment(selectedSlot.end).format('MM/DD/YYYY HH:mm')
                          : ''
                    }
                    placeholder="MM/DD/YYYY HH:mm"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="status"
                    defaultValue={selectedSlot?.status || 'available'}
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" type="submit" mr={3}>
                {selectedSlot?.id ? 'Update' : 'Create'}
              </Button>
              {selectedSlot?.id && (
                <Button colorScheme="red" onClick={handleDelete} mr={3}>
                  Delete
                </Button>
              )}
              <Button variant="ghost" onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DoctorSchedulePage;