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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';
import ChildList from '@/components/Child/ChildList';

const ChildPage = () => {
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
          <Heading size='xl' mb={2}>
            Child Management
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Add, view, and manage information about your children
          </Text>
        </Box>

        {/* Child List Component */}
        <ChildList />
      </Container>
    </Box>
  );
};

export default ChildPage;
