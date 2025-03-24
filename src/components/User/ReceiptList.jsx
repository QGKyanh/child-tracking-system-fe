import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  Button,
  Select,
  Center,
  Spinner,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { useGetReceiptsByUserIdQuery } from '@/services/receipt/receiptApi';

const ReceiptList = ({ userId }) => {
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('descending');

  const { data, isLoading, error } = useGetReceiptsByUserIdQuery(
    { userId, page, size, sortBy, order },
    { skip: !userId }
  );

  const receipts = data?.receipts || [];
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.data?.message || 'Failed to load receipts.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const formatCurrency = (amount) =>
    amount?.value && amount?.currency
      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: amount.currency }).format(amount.value)
      : 'N/A';

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString('en-US') : 'N/A';

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="blue.500" />
        <Text ml={4}>Loading receipts...</Text>
      </Center>
    );
  }

  if (!receipts.length === 0) {
    return (
      <Box p={6} textAlign="center">
      <Heading as="h2" size="lg" mb={6}>
        Payment History
      </Heading>
        <Text>No receipts found.</Text>
      </Box>
    );
  }

  return (
    <Box pt={10} maxW="container.lg" mx="auto">
      <Heading as="h2" size="lg" mb={6}>
        Payment History
      </Heading>
      {/* Sorting & Pagination Controls */}
      <Flex mb={4} justify="space-between" align="center">
        <Select value={order} onChange={(e) => setOrder(e.target.value)} w="200px">
          <option value="ascending">Date: Ascending</option>
          <option value="descending">Date: Descending</option>
        </Select>
        <Select value={size} onChange={(e) => setSize(Number(e.target.value))} w="150px">
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </Select>
      </Flex>

      <VStack spacing={4} align="stretch">
        <Table variant="simple" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Transaction ID</Th>
              <Th>Amount</Th>
              <Th>Payment Method</Th>
              <Th>Payment Gateway</Th>
              <Th>Type</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {receipts.map((receipt) => (
              <Tr key={receipt._id}>
                <Td>
                  <Text isTruncated maxW="150px" title={receipt.transactionId}>
                    {receipt.transactionId}
                  </Text>
                </Td>
                <Td>{formatCurrency(receipt.totalAmount)}</Td>
                <Td>{receipt.paymentMethod}</Td>
                <Td>{receipt.paymentGateway}</Td>
                <Td>{receipt.type}</Td>
                <Td>{formatDate(receipt.createdAt)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>

      {/* Pagination Controls */}
      <Flex mt={6} justify="space-between" align="center">
        <Button isDisabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <Text>
          Page {page} of {totalPages}
        </Text>
        <Button isDisabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default ReceiptList;
