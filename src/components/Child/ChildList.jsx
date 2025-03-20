import { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Flex,
  Heading,
  Spinner,
  Center,
  useDisclosure,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  useGetListChildrenQuery,
  useDeleteChildMutation,
} from '@/services/child/childApi';
import ChildDetail from './ChildDetail';
import ChildForm from './ChildForm';
import ChildCard from './ChildCard';
import ChildAddButton from './ChildAddButton';
import EmptyChildList from './EmptyChildList';

const ChildList = () => {
  const { data, isLoading, isError, error } = useGetListChildrenQuery();
  const [deleteChild] = useDeleteChildMutation();

  // Modal controls
  const detailModal = useDisclosure();
  const formModal = useDisclosure();

  // State for selected child
  const [selectedChild, setSelectedChild] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Handle view details
  const handleViewDetail = child => {
    setSelectedChild(child);
    detailModal.onOpen();
  };

  // Handle edit child
  const handleEditChild = child => {
    setSelectedChild(child);
    setIsEditMode(true);
    formModal.onOpen();
  };

  // Handle add new child
  const handleAddChild = () => {
    setSelectedChild(null);
    setIsEditMode(false);
    formModal.onOpen();
  };

  // Handle delete child
  const handleDeleteChild = async id => {
    if (window.confirm('Are you sure you want to delete this child?')) {
      try {
        await deleteChild(id).unwrap();
      } catch (err) {
        console.error('Failed to delete the child:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <Center h='300px'>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='#3498DB'
          size='xl'
        />
      </Center>
    );
  }

  if (isError) {
    return (
      <Alert status='error'>
        <AlertIcon />
        Error loading children: {error?.data?.message || 'Unknown error'}
      </Alert>
    );
  }

  return (
    <Box>
      <Flex justify='space-between' align='center' mb={6}>
        <Heading size='lg'>Your Children</Heading>
        <ChildAddButton onClick={handleAddChild} />
      </Flex>

      {data?.children && data.children.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {data.children.map(child => (
            <ChildCard
              key={child._id}
              child={child}
              onView={handleViewDetail}
              onEdit={handleEditChild}
              onDelete={handleDeleteChild}
            />
          ))}
        </SimpleGrid>
      ) : (
        <EmptyChildList onAddChild={handleAddChild} />
      )}

      {/* Child Detail Modal */}
      <ChildDetail
        isOpen={detailModal.isOpen}
        onClose={detailModal.onClose}
        child={selectedChild}
        onEdit={() => {
          detailModal.onClose();
          handleEditChild(selectedChild);
        }}
      />

      {/* Child Form Modal */}
      <ChildForm
        isOpen={formModal.isOpen}
        onClose={formModal.onClose}
        childData={isEditMode ? selectedChild : null}
        isEditMode={isEditMode}
      />
    </Box>
  );
};

export default ChildList;
