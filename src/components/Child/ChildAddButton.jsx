import { Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const ChildAddButton = ({ onClick, size = 'md', variant = 'solid' }) => {
  return (
    <Button
      leftIcon={<AddIcon />}
      colorScheme='blue'
      onClick={onClick}
      size={size}
      variant={variant}
    >
      Add Child
    </Button>
  );
};

export default ChildAddButton;
