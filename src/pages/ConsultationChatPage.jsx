import {
  Box,
  Flex,
  VStack,
  Avatar,
  Text,
  HStack,
  Input,
  Button,
  Spinner,
  Image,
  useToast,
  IconButton,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/services/auth/authSlice';
import {
  useGetMessagesByConsultationIdQuery,
  useCreateMessageMutation,
} from '@/services/consultations/messagesApi';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowBackIcon, CloseIcon, InfoOutlineIcon } from '@chakra-ui/icons';

const ConsultationChatPage = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const userId = user?._id;
  const toast = useToast();
  const location = useLocation();
  const requestIndex = location.state?.index;

  // The key issue: your API expects an object parameter but receives just the ID
  const { data, isLoading, refetch } = useGetMessagesByConsultationIdQuery(
    {
      consultationId: consultationId,
    },
    {
      pollingInterval: 10000, // Poll every 10 seconds for new messages
    }
  );

  const [createMessage] = useCreateMessageMutation();

  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [messagesState, setMessages] = useState([]);
  const [consultationInfo, setConsultationInfo] = useState(null);
  const scrollRef = useRef(null);

  // Debug logs
  useEffect(() => {
    console.log('API data received:', data);
    console.log('ConsultationId:', consultationId);
    console.log('Current user ID:', userId);
  }, [data, consultationId, userId]);

  // This effect synchronizes the API data with local state
  useEffect(() => {
    if (data) {
      // Your API returns an array directly but we need to check if it has the consultationMessages property
      const messages = data.consultationMessages || data;

      console.log('Messages from API:', messages);

      if (Array.isArray(messages) && messages.length > 0) {
        const formattedMessages = messages.map(msg => ({
          id: msg._id,
          sender: msg.sender,
          message: msg.message,
          attachments: msg.attachments || [],
          createdAt: msg.createdAt,
          senderInfo: msg.senderInfo,
        }));

        console.log('Formatted messages:', formattedMessages);
        setMessages(formattedMessages);

        // Extract consultation info if available
        if (messages[0].consultation?.requestDetails) {
          setConsultationInfo(messages[0].consultation.requestDetails);
        }
      }
    }
  }, [data]);

  // Force a refetch when component mounts
  useEffect(() => {
    console.log('Component mounted, forcing API refetch');
    refetch();
  }, [refetch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesState]);

  const handleSendMessage = async () => {
    if (!text && files.length === 0) return;

    const formData = new FormData();
    formData.append('consultationId', consultationId);
    if (text) formData.append('message', text);
    files.forEach(file => formData.append('messageAttachments', file));

    // Create an optimistic update with a temporary ID
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      sender: userId,
      message: text,
      attachments: files.map(file => URL.createObjectURL(file)),
      createdAt: new Date().toISOString(),
      senderInfo: {
        _id: userId,
        name: user?.name,
        avatar: user?.avatar,
        role: user?.role,
      },
      isOptimistic: true,
    };

    // Add the optimistic message to the messages state
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      // Send the message to the backend
      console.log('Sending message:', { text, files: files.length });
      await createMessage(formData).unwrap();

      // Clear the form
      setText('');
      setFiles([]);

      // Refetch messages after sending
      refetch();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Failed to send message',
        description: error?.data?.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });

      // Remove the optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const handleRemoveFile = index => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const getChildrenInfo = () => {
    if (!consultationInfo) return null;

    return (
      <Box>
        <Text fontWeight='semibold' mb={1}>
          Children:
        </Text>
        {consultationInfo.children?.map(child => (
          <Box key={child._id} mb={2} pl={2}>
            <Text>
              <Badge colorScheme={child.gender === 0 ? 'pink' : 'blue'} mr={2}>
                {child.gender === 0 ? 'Girl' : 'Boy'}
              </Badge>
              {child.name}, {calculateAge(child.birthDate)}
            </Text>
            <Text fontSize='sm' color='gray.600'>
              Allergies: {formatAllergies(child.allergies)}
            </Text>
            {child.note && (
              <Text fontSize='sm' color='gray.600'>
                Note: {child.note}
              </Text>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const calculateAge = birthDate => {
    const dob = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return `${age} years old`;
  };

  const formatAllergies = allergies => {
    if (!allergies || allergies.length === 0) return 'None';

    const allergyMap = {
      DRUG_ALLERGY: 'Drug',
      FOOD_ALLERGY: 'Food',
      MOLD_ALLERGY: 'Mold',
      INSECT_ALLERGY: 'Insect',
      LATEX_ALLERGY: 'Latex',
      PET_ALLERGY: 'Pet',
      POLLEN_ALLERGY: 'Pollen',
      OTHER_ALLERGY: 'Other',
    };

    return allergies.map(allergy => allergyMap[allergy] || allergy).join(', ');
  };

  return (
    <Flex h='100vh' direction='column' bg='gray.50' p={4}>
      {/* Header */}
      <HStack mb={4} justifyContent='space-between'>
        <HStack>
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => navigate('/consultations')}
            aria-label='Back'
            variant='ghost'
          />
          <Text fontSize='xl' fontWeight='bold'>
            Consultation {requestIndex ? `#${requestIndex}` : ''}
          </Text>
        </HStack>

        {consultationInfo && (
          <Tooltip
            hasArrow
            label={getChildrenInfo()}
            placement='bottom-end'
            bg='white'
            color='black'
            borderRadius='md'
            boxShadow='md'
            p={3}
            width='300px'
          >
            <IconButton
              icon={<InfoOutlineIcon />}
              aria-label='Consultation Info'
              size='sm'
              variant='ghost'
              colorScheme='blue'
            />
          </Tooltip>
        )}
      </HStack>

      {/* Debug information - remove in production */}
      {/* {process.env.NODE_ENV !== 'production' && (
        <Box p={2} bg='yellow.100' mb={2} borderRadius='md'>
          <Text fontSize='xs'>ConsultationID: {consultationId}</Text>
          <Text fontSize='xs'>Messages Count: {messagesState.length}</Text>
          <Text fontSize='xs'>Loading: {isLoading ? 'Yes' : 'No'}</Text>
        </Box>
      )} */}

      {/* Message Display Area */}
      <VStack
        flex={1}
        spacing={3}
        align='stretch'
        overflowY='auto'
        ref={scrollRef}
        bg='white'
        borderRadius='md'
        p={4}
        boxShadow='sm'
      >
        {isLoading ? (
          <Spinner alignSelf='center' />
        ) : messagesState.length === 0 ? (
          <Text color='gray.500' alignSelf='center'>
            No messages yet. Start the conversation!
          </Text>
        ) : (
          messagesState.map(msg => (
            <HStack
              key={msg.id}
              justify={msg.sender === userId ? 'flex-end' : 'flex-start'}
              align='flex-end'
              spacing={2}
              opacity={msg.isOptimistic ? 0.7 : 1}
            >
              {msg.sender !== userId && (
                <Avatar
                  name={msg.senderInfo?.name}
                  src={msg.senderInfo?.avatar}
                  size='sm'
                />
              )}
              <Box
                bg={msg.sender === userId ? 'blue.100' : 'gray.100'}
                px={4}
                py={2}
                borderRadius='lg'
                maxW='70%'
              >
                {msg.message && <Text mb={2}>{msg.message}</Text>}
                {msg.attachments?.length > 0 && (
                  <VStack
                    spacing={2}
                    align={msg.sender === userId ? 'flex-end' : 'flex-start'}
                  >
                    {msg.attachments.map((url, i) => (
                      <Image
                        key={i}
                        src={url}
                        alt={`attachment-${i}`}
                        borderRadius='md'
                        fallbackSrc='https://via.placeholder.com/150'
                        maxW='250px'
                        objectFit='cover'
                      />
                    ))}
                  </VStack>
                )}
                <Text fontSize='xs' color='gray.500' textAlign='right'>
                  {new Date(msg.createdAt).toLocaleString()}
                </Text>
              </Box>
              {msg.sender === userId && (
                <Avatar name={user?.name} src={user?.avatar} size='sm' />
              )}
            </HStack>
          ))
        )}
      </VStack>

      {/* Input Area */}
      <Box mt={4} bg='white' borderRadius='md' p={4} boxShadow='sm'>
        {/* File Preview */}
        {files.length > 0 && (
          <HStack spacing={3} mb={3} wrap='wrap'>
            {files.map((file, idx) => (
              <Box key={idx} position='relative'>
                <Image
                  src={URL.createObjectURL(file)}
                  boxSize='60px'
                  objectFit='cover'
                  borderRadius='md'
                  fallbackSrc='https://via.placeholder.com/60'
                  alt='preview'
                />
                <IconButton
                  icon={<CloseIcon boxSize={2.5} />}
                  size='xs'
                  position='absolute'
                  top='-1'
                  right='-1'
                  onClick={() => handleRemoveFile(idx)}
                  aria-label='Remove file'
                  colorScheme='red'
                  borderRadius='full'
                />
              </Box>
            ))}
          </HStack>
        )}

        {/* Message Input */}
        <HStack spacing={3} align='flex-end'>
          <Box flex={3}>
            <Input
              placeholder='Type your message...'
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              bg='white'
            />
          </Box>
          <Input
            type='file'
            multiple
            accept='image/*'
            onChange={e => setFiles(Array.from(e.target.files))}
            hidden
            id='file-input'
          />
          <Button
            as='label'
            htmlFor='file-input'
            colorScheme='gray'
            cursor='pointer'
            size='md'
          >
            Attach
          </Button>
          <Button
            colorScheme='blue'
            onClick={handleSendMessage}
            isDisabled={!text && files.length === 0}
          >
            Send
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};

export default ConsultationChatPage;
