import { Box, SimpleGrid } from '@chakra-ui/react';
import ChildCard from './ChildCard';
import EmptyChildList from './EmptyChildList';

const ChildList = ({ children = [], onView, onEdit, onDelete, onAdd }) => {
  // If no children, show empty state
  if (children.length === 0) {
    return <EmptyChildList onAddChild={onAdd} />;
  }

  // Otherwise, render the grid of child cards
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {children.map(child => (
          <ChildCard
            key={child._id}
            child={child}
            onView={() => onView(child._id)}
            onEdit={() => onEdit(child._id)}
            onDelete={() => onDelete(child._id)}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ChildList;
