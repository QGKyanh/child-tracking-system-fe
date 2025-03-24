// pages/ConsultationChatPage.jsx
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
    IconButton
  } from '@chakra-ui/react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { useSelector } from 'react-redux';
  import { selectCurrentUser } from '@/services/auth/authSlice';
  import {
    useGetMessagesByConsultationIdQuery,
    useCreateMessageMutation
  } from '@/services/consultations/messagesApi';
  import { useLocation } from 'react-router-dom';

  import { useEffect, useRef, useState } from 'react';
  import { ArrowBackIcon, CloseIcon } from '@chakra-ui/icons';
  
  const ConsultationChatPage = () => {
    const { consultationId } = useParams();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const userId = user?._id;
    const toast = useToast();
    const location = useLocation();
    const requestIndex = location.state?.index;
    console.log("userId:",userId);
    const { data: messages = [], isLoading } = useGetMessagesByConsultationIdQuery(consultationId);
    const [createMessage] = useCreateMessageMutation();
  
    const [text, setText] = useState('');
    const [files, setFiles] = useState([]);
    const scrollRef = useRef(null);
  
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages]);
  
    const handleSendMessage = async () => {
      if (!text && files.length === 0) return;
  
      const formData = new FormData();
      formData.append('consultationId', consultationId);
      if (text) formData.append('message', text);
      files.forEach((file) => formData.append('messageAttachments', file));
  
      try {
        await createMessage(formData).unwrap();
        setText('');
        setFiles([]);
      } catch (error) {
        toast({
          title: 'Failed to send message',
          description: error?.data?.message || 'Something went wrong.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
  
    const handleRemoveFile = (index) => {
      setFiles(files.filter((_, i) => i !== index));
    };
  
    return (
      <Flex h="100vh" direction="column" bg="gray.50" p={4}>
        <HStack mb={4}>
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => navigate('/consultations')}
            aria-label="Back"
            variant="ghost"
          />
        <Text fontSize="xl" fontWeight="bold">
  Consultation Chat {requestIndex ? `#${requestIndex}` : ''}
</Text>

        </HStack>
  
        <VStack flex={1} spacing={3} align="stretch" overflowY="auto" ref={scrollRef}>
          {isLoading ? (
            <Spinner alignSelf="center" />
          ) : messages.length === 0 ? (
            <Text color="gray.500" alignSelf="center">No messages yet</Text>
          ) : (
            messages.map((msg, idx) => (
              <HStack
                key={idx}
                justify={msg.sender === userId ? 'flex-end' : 'flex-start'}
                align="flex-end"
                spacing={2}
              >
                {msg.sender !== userId && (
                  <Avatar name={msg.senderInfo?.name} src={msg.senderInfo?.avatar} size="sm" />
                )}
                <Box
                  bg={msg.sender === userId ? 'blue.100' : 'gray.100'}
                  px={4}
                  py={2}
                  borderRadius="lg"
                  maxW="70%"
                >
                  {msg.message && <Text mb={2}>{msg.message}</Text>}
                  {msg.attachments?.length > 0 && (
                    <VStack spacing={2}>
                      {msg.attachments.map((url, i) => (
                        <Image
                          key={i}
                          src={url}
                          alt={`attachment-${i}`}
                          borderRadius="md"
                          fallbackSrc="https://via.placeholder.com/150"
                          maxW="250px"
                          objectFit="cover"
                        />
                      ))}
                    </VStack>
                  )}
                  <Text fontSize="xs" color="gray.500" textAlign="right">
                    {new Date(msg.createdAt).toLocaleString()}
                  </Text>
                </Box>
                {msg.sender === userId && (
                  <Avatar name={user?.name} src={user?.avatar} size="sm" />
                )}
              </HStack>
            ))
          )}
        </VStack>
  
        {/* File + Message input */}
        <HStack mt={4} spacing={3} align="stretch">
          <Box flex={3}>
            <Input
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Box>
          <Box flex={1}>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />
          </Box>
          <Button colorScheme="blue" onClick={handleSendMessage}>Send</Button>
        </HStack>
  
        {/* Preview attachments */}
        {files.length > 0 && (
          <HStack spacing={3} mt={2} wrap="wrap">
            {files.map((file, idx) => (
              <Box key={idx} position="relative">
                <Image
                  src={URL.createObjectURL(file)}
                  boxSize="60px"
                  objectFit="cover"
                  borderRadius="md"
                  fallbackSrc="https://via.placeholder.com/60"
                  alt="preview"
                />
                <IconButton
                  icon={<CloseIcon boxSize={2.5} />}
                  size="xs"
                  position="absolute"
                  top="-1"
                  right="-1"
                  onClick={() => handleRemoveFile(idx)}
                  aria-label="Remove file"
                />
              </Box>
            ))}
          </HStack>
        )}
      </Flex>
    );
  };
  
  export default ConsultationChatPage;
  