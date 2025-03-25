import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetBlogByIdQuery } from '@/services/blogs/blogApi';
import {
  Alert,
  AlertIcon,
  Spinner,
  useDisclosure,
  Container,
  Box,
  BreadcrumbItem,
  Breadcrumb,
  BreadcrumbLink,
  Flex,
  Text,
  Heading,
  Avatar,
  Divider,
  SimpleGrid,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  WrapItem,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import CommentBox from '@/components/Comments/CommentBox';
import CommentList from '@/components/Comments/CommentList';

export default function BlogDetail() {
  const { blogId } = useParams();
  const { data, isLoading, isError, error } = useGetBlogByIdQuery(blogId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = imgUrl => {
    setSelectedImage(imgUrl);
    onOpen();
  };

  return (
    <Box>
      <Container maxW='container.xl' pt={4} pb={10}>
        {/* Breadcrumb */}
        <Breadcrumb
          spacing='8px'
          separator={<ChevronRightIcon color='gray.500' />}
          mb={6}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to='/'>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to='/blog'>
              Blog
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{data?.post?.title || 'Loading...'}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Loading State */}
        {isLoading && (
          <Flex justify='center' align='center' h='300px'>
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
          </Flex>
        )}

        {/* Error State */}
        {isError && (
          <Alert status='error'>
            <AlertIcon />
            {error?.data?.message || 'Error loading blog post'}
          </Alert>
        )}

        {/* Blog Content */}
        {!isLoading && !isError && data?.post && (
          <>
            <Box mb={8}>
              <Flex justify='space-between' align='center'>
                <Box>
                  <Heading size='xl' mb={2}>
                    {data.post.title}
                  </Heading>
                  <Flex justifyContent={'flex-start'} align={'flex-start'}>
                    <WrapItem mr={5}>
                      <Avatar
                        name={data.post.user.name || 'Unknown Author'}
                        src={data.post.user.avatar}
                      />
                    </WrapItem>
                    <div>
                      <Text color='gray.500'>
                        By {data.post.user.name || 'Unknown Author'}
                      </Text>
                      <Text color='gray.500' fontSize='sm'>
                        {format(new Date(data.post.createdAt), 'MMM dd, yyyy')}
                      </Text>
                    </div>
                  </Flex>
                </Box>
              </Flex>
            </Box>

            <Box
              className='content-area'
              fontSize={{ base: 'md', md: 'lg' }}
              lineHeight={1.7}
              dangerouslySetInnerHTML={{ __html: data.post.content }}
              sx={{
                '& p': { mb: 6, color: 'gray.700' },
                '& img': {
                  my: 8,
                  mx: 'auto',
                  borderRadius: 'lg',
                  maxW: 'full',
                  h: 'auto',
                },
              }}
            />
            {/* Comment Box and Comment List */}
            <Divider my={6} />
            <CommentBox postId={blogId} />
            <CommentList postId={blogId} />
            {/* Image Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />
                <ModalBody p={0}>
                  <Image
                    src={selectedImage}
                    alt='Full size'
                    w='full'
                    h='90vh'
                    objectFit='contain'
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )}
      </Container>
    </Box>
  );
}
