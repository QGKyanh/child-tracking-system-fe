import { useGetListMembershipPackagesQuery } from '@/services/membership/membershipApi';
import React, { useState } from 'react';
import {
  Box,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  useColorModeValue,
  VStack,
  Heading,
  Text,
  useDisclosure, // Added missing import for Text
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import MembershipList from '@/components/Membership/MembershipList';
import CheckoutModal from '@/components/Membership/CheckoutModal';

const MembershipPage = () => {
  const [page, setPage] = useState(1);
  const [size] = useState(3);
  const { data, isLoading, isError, error } = useGetListMembershipPackagesQuery(
    { page, size }
  );

  const checkoutModal = useDisclosure();
  const [packageId, setPackageId] = useState(null);
  const [type, setType] = useState(null);
  // Call useColorModeValue unconditionally
  const bgColor = useColorModeValue('#F7FAFC', 'gray.700');

  const openCheckoutModal = (packageId, type) => {
    setPackageId(packageId);
    setType(type);
    checkoutModal.onOpen();
  };

  const handleNextPage = () => {
    if (data && page < data.totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  return (
    <Box>
      <Container maxW='container.xl' pt={4} pb={10}>
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
            <BreadcrumbLink>Plans</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

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
            Error loading memberships: {error?.data?.message || 'Unknown error'}
          </Alert>
        ) : (
          <Box
            width='full'
            py={10}
            bg={bgColor} // Use the stored value
            borderRadius='lg'
          >
            <VStack spacing={5} textAlign='center' mb={10}>
              <Heading as='h2' size='xl'>
                Membership Plans
              </Heading>
              <Text color={'gray.500'} maxW={'3xl'}>
                Choose the plan that best fits your family's needs
              </Text>
            </VStack>
            <MembershipList
              memberships={data.packages || []}
              currentPage={page}
              totalPages={data.totalPages || 1}
              onNext={handleNextPage}
              onPrev={handlePrevPage}
              onCheckout={openCheckoutModal}
              type='ALL'
            />
          </Box>
        )}

        <CheckoutModal
          isOpen={checkoutModal.isOpen}
          onClose={checkoutModal.onClose}
          packageId={packageId}
          type={type}
        />
      </Container>
    </Box>
  );
};

export default MembershipPage;
