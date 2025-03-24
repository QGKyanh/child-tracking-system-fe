import BlogModal from '@/components/Blogs/BlogModal';
import { useGetListBlogsQuery } from '@/services/blogs/blogApi';
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogPage() {
  const blogModal = useDisclosure();
  const { data, isLoading, isError, error, refetch } = useGetListBlogsQuery();
  return (
    <>
      <Box>
        <Container maxW='container.xl' pt={4} pb={10}>
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
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Blogs</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Button onClick={blogModal.onOpen}>Post Blogs</Button>
          <BlogModal
            isOpen={blogModal.isOpen}
            handleClose={blogModal.onClose}
          ></BlogModal>

          {isLoading ? (
            <Center h='300px'>
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
              />
            </Center>
          ) : isError ? (
            <Alert status='error'>
              <AlertIcon />
              Error loading children: {error?.data?.message || 'Unknown error'}
            </Alert>
          ) : (
            <></>
          )}
        </Container>
      </Box>
    </>
  );
}
