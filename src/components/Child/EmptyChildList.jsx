import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import ChildAddButton from './ChildAddButton';

const EmptyChildList = ({ onAddChild }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box
      p={8}
      borderWidth={1}
      borderRadius='lg'
      bg={bgColor}
      textAlign='center'
    >
      <Heading size='md' mb={3}>
        No children found
      </Heading>
      <Text mb={6}>Add your first child to start tracking their growth</Text>
      <ChildAddButton onClick={onAddChild} />
    </Box>
  );
};

export default EmptyChildList;
