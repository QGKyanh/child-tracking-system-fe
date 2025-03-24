import BlogModal from '@/components/Blogs/BlogModal';
import { useGetListBlogsQuery } from '@/services/blogs/blogApi';
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Container,
  Image,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  Card,
  CardBody,
  Heading,
  Select,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BlogPage() {
  const blogModal = useDisclosure();

  // State để lưu query params
  const [order, setOrder] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Gọi API với params
  const { data, isLoading, isError, error } = useGetListBlogsQuery({ page, order, sortBy, search });

  // Lấy totalPages từ API
  const totalPages = data?.totalPages || 1;

  return (
    <Box>
      <Container maxW="container.xl" pt={4} pb={10}>
        {/* Breadcrumb */}
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={6}>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Blogs</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Bộ lọc & Tìm kiếm */}
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} mb={8}>
          <Select placeholder="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="date">Date</option>
          </Select>
          <Select placeholder="Order" value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </Select>
          <InputGroup>
            <Input 
              placeholder="Search blogs..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
            <InputRightElement>
              <IconButton aria-label="Search" icon={<SearchIcon />} onClick={() => setPage(1)} />
            </InputRightElement>
          </InputGroup>
          <Button onClick={blogModal.onOpen} colorScheme="blue">Post Blogs</Button>
        </SimpleGrid>

        <BlogModal isOpen={blogModal.isOpen} handleClose={blogModal.onClose} />

        {/* Loading & Error State */}
        {isLoading ? (
          <Center h="300px">
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          </Center>
        ) : isError ? (
          <Alert status="error">
            <AlertIcon />
            Error loading blogs: {error?.data?.message || 'Unknown error'}
          </Alert>
        ) : (
          <>
            {/* Danh sách bài viết */}
            <SimpleGrid columns={[1, 2, 3, 5]} spacing={6}>
              {data?.posts?.map((blog) => (
                <Card key={blog._id} borderRadius="lg" overflow="hidden" boxShadow="lg">
                  <Image src={blog.thumbnailUrl || 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg'} alt={blog.title} objectFit="cover" w="100%" h="200px" />
                  <CardBody display="flex" flexDirection="column" justifyContent="space-between">
                    <Heading size="md" mb={2}>{blog.title}</Heading>
                    <Text noOfLines={2} mb={3}>{blog.description}</Text>
                    <Button as={Link} to={`/blog/${blog._id}`} colorScheme="blue" size="sm">
                      Read More
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={6} gap={2}>
              {/* Nút Previous */}
              <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} isDisabled={page === 1}>
                Previous
              </Button>

              {/* Hiển thị số trang */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <Button 
                    key={pageNumber} 
                    onClick={() => setPage(pageNumber)} 
                    colorScheme={page === pageNumber ? 'blue' : 'gray'}
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              {/* Nút Next */}
              <Button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} isDisabled={page === totalPages}>
                Next
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
