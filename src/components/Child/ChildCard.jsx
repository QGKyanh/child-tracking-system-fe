import {
  Card,
  CardBody,
  CardFooter,
  Box,
  Heading,
  Text,
  Badge,
  Avatar,
  Flex,
  VStack,
  IconButton,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';

const ChildCard = ({ child, onView, onEdit, onDelete }) => {
  // Card styling
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardFooterBg = useColorModeValue('gray.50', 'gray.700');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');

  // Get background gradient based on gender
  const getBgGradient = gender => {
    return gender === 0
      ? 'linear(to-r, blue.50, blue.100)'
      : 'linear(to-r, pink.50, pink.100)';
  };

  // Calculate age from birthdate
  const calculateAge = birthDate => {
    const today = new Date();
    const birth = new Date(birthDate);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }

    if (years === 0) {
      return `${months} ${months === 1 ? 'month' : 'months'} old`;
    } else {
      return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${
        months === 1 ? 'month' : 'months'
      } old`;
    }
  };

  return (
    <Card
      overflow='hidden'
      variant='outline'
      bg={cardBg}
      _hover={{
        transform: 'translateY(-5px)',
        transition: 'transform 0.3s ease',
        boxShadow: 'md',
      }}
    >
      <Box h='8px' bgGradient={getBgGradient(child.gender)} />
      <CardBody>
        <Flex align='center' mb={4}>
          <Avatar
            size='lg'
            name={child.name}
            bg={child.gender === 0 ? 'blue.400' : 'pink.400'}
            color='white'
            mr={4}
          />
          <VStack align='start' spacing={1}>
            <Heading size='md'>{child.name}</Heading>
            <Badge colorScheme={child.gender === 0 ? 'blue' : 'pink'}>
              {child.gender === 0 ? 'Boy' : 'Girl'}
            </Badge>
          </VStack>
        </Flex>
        <VStack align='start' spacing={2}>
          <Text>
            <Text as='span' fontWeight='bold'>
              Age:
            </Text>{' '}
            {calculateAge(child.birthDate)}
          </Text>
          <Text>
            <Text as='span' fontWeight='bold'>
              Birth Date:
            </Text>{' '}
            {format(new Date(child.birthDate), 'PP')}
          </Text>
          {child.note && (
            <Text noOfLines={2}>
              <Text as='span' fontWeight='bold'>
                Note:
              </Text>{' '}
              {child.note}
            </Text>
          )}
        </VStack>
      </CardBody>
      <CardFooter
        bg={cardFooterBg}
        borderTop='1px'
        borderColor={cardBorderColor}
        justify='center'
        gap={2}
      >
        <Tooltip label='View Details'>
          <IconButton
            icon={<ViewIcon />}
            variant='ghost'
            colorScheme='blue'
            onClick={() => onView(child)}
            aria-label='View details'
          />
        </Tooltip>
        <Tooltip label='Edit'>
          <IconButton
            icon={<EditIcon />}
            variant='ghost'
            colorScheme='green'
            onClick={() => onEdit(child)}
            aria-label='Edit child'
          />
        </Tooltip>
        <Tooltip label='Delete'>
          <IconButton
            icon={<DeleteIcon />}
            variant='ghost'
            colorScheme='red'
            onClick={() => onDelete(child._id)}
            aria-label='Delete child'
          />
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default ChildCard;
