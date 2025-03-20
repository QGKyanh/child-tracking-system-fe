import { useState } from 'react';
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
import ChildList from '@/components/Child/ChildList';
import ChildDetail from '@/components/Child/ChildDetail';
import ChildForm from '@/components/Child/ChildForm';
import ChildAddButton from '@/components/Child/ChildAddButton';
import {
  useGetListChildrenQuery,
  useDeleteChildMutation,
} from '@/services/child/childApi';

const ChildPage = () => {
  // API queries and mutations
  const { data, isLoading, isError, error, refetch } =
    useGetListChildrenQuery();
  const [deleteChild] = useDeleteChildMutation();

  // Modal states
  const detailModal = useDisclosure();
  const formModal = useDisclosure();

  // Selected child state
  const [selectedChildId, setSelectedChildId] = useState(null);

  // Handlers for child operations
  const handleViewChild = childId => {
    setSelectedChildId(childId);
    detailModal.onOpen();
  };

  const handleAddChild = () => {
    setSelectedChildId(null);
    formModal.onOpen();
  };

  const handleEditChild = childId => {
    setSelectedChildId(childId);
    formModal.onOpen();
  };

  const handleDeleteChild = async childId => {
    if (window.confirm('Are you sure you want to delete this child?')) {
      try {
        await deleteChild(childId).unwrap();
      } catch (err) {
        console.error('Failed to delete the child:', err);
      }
    }
  };

  // Handle form close (success)
  const handleFormClose = () => {
    formModal.onClose();
    refetch(); // Refresh the list after add/edit
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
            <BreadcrumbLink as={RouterLink} to='/'>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Children</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Page Header */}
        <Box mb={8}>
          <Flex justify='space-between' align='center'>
            <Box>
              <Heading size='xl' mb={2}>
                Child Management
              </Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')}>
                Add, view, and manage information about your children
              </Text>
            </Box>
            <ChildAddButton onClick={handleAddChild} />
          </Flex>
        </Box>

        {/* Loading/Error States */}
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
          /* Child List Component */
          <ChildList
            children={data?.children || []}
            onView={handleViewChild}
            onEdit={handleEditChild}
            onDelete={handleDeleteChild}
            onAdd={handleAddChild}
          />
        )}

        {/* Modals */}
        <ChildDetail
          isOpen={detailModal.isOpen}
          onClose={detailModal.onClose}
          childId={selectedChildId}
          onEdit={() => {
            detailModal.onClose();
            handleEditChild(selectedChildId);
          }}
        />

        <ChildForm
          isOpen={formModal.isOpen}
          onClose={handleFormClose}
          childId={selectedChildId}
        />
      </Container>
    </Box>
  );
};

export default ChildPage;
