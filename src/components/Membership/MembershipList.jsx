import React from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  Stack,
  Heading,
} from '@chakra-ui/react';

export default function MembershipList({
  memberships,
  currentPage,
  totalPages,
  onNext,
  onPrev,
  onCheckout,
}) {
  return (
    <Box>
      <Box
        overflowX={{ base: 'auto', md: 'hidden' }}
        overflowY='hidden'
        whiteSpace='nowrap'
        mb={6}
        px={{ base: 4, md: 0 }}
      >
        <Flex
          direction={{ base: 'row', md: 'row' }}
          gap={10}
          align={{ base: 'center', md: 'center' }}
          justify='space-evenly'
          paddingTop={5}
          paddingBottom={5}
        >
          {memberships.length > 0 ? (
            memberships.map(membership => (
              <Box
                key={membership._id}
                w={{ base: 'full', md: '330px' }}
                maxW='330px'
                bg='white'
                boxShadow='2xl'
                rounded='md'
                overflow='hidden'
                transition='transform 0.3s ease-in-out'
                _hover={{ transform: 'scale(1.05)' }}
                mb={{ base: 4, md: 0 }}
              >
                <Box p={6}>
                  <Stack spacing={0} align='center' mb={5}>
                    <Heading size='md' fontWeight={500}>
                      {membership.name}
                    </Heading>
                    <Text color='gray.500'>{membership.description}</Text>
                  </Stack>

                  <Stack direction='row' align='center' justify='center' mb={5}>
                    <Text fontWeight={800} fontSize='3xl'>
                      {membership.price.unit === 'USD'
                        ? `$${membership.price.value}`
                        : `${membership.price.value}VNĐ`}{' '}
                      {/* Updated for flexibility */}
                    </Text>
                    <Text color='gray.500'>
                      /
                      {`${membership.duration.value} ${
                        membership.duration.value > 1
                          ? `${membership.duration.unit.toLowerCase()}s`
                          : membership.duration.unit.toLowerCase()
                      }`}
                    </Text>
                  </Stack>

                  <VStack spacing={2} mb={5}>
                    <Text>Posts Allowed: {membership.postLimit || 0}</Text>
                    <Text>
                      Growth Data Entries:{' '}
                      {membership.updateChildDataLimit || 0}
                    </Text>
                    <Text>
                      Downloadable Charts: {membership.downloadChart || 0}
                    </Text>
                  </VStack>
                  <Flex gap={5} justifyContent='space-evenly'>
                    <Button
                      w='half'
                      mt={8}
                      bg='#3498DB'
                      color='white'
                      rounded='md'
                      _hover={{ bg: '#2980B9' }}
                      onClick={() => onCheckout(membership._id, 'CURRENT')}
                    >
                      Upgrade
                    </Button>

                    <Button
                      w='half'
                      mt={8}
                      bg='rgb(52, 219, 69)'
                      color='white'
                      rounded='md'
                      _hover={{ bg: 'rgb(48, 185, 41)' }}
                      onClick={() => onCheckout(membership._id, 'FUTURE')}
                    >
                      Add-On
                    </Button>
                  </Flex>
                </Box>
              </Box>
            ))
          ) : (
            <Text>No memberships available.</Text>
          )}
        </Flex>
      </Box>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <Flex
          justify='space-between'
          marginLeft={10}
          marginRight={10}
          align='center'
        >
          <Button onClick={onPrev} isDisabled={currentPage === 1}>
            Previous
          </Button>

          <Button onClick={onNext} isDisabled={currentPage === totalPages}>
            Next
          </Button>
        </Flex>
      )}
    </Box>
  );
}
