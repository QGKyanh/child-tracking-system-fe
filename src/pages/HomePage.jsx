import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Icon,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaChild,
  FaChartLine,
  FaBell,
  FaUserMd,
  FaUsers,
} from 'react-icons/fa';
import MembershipList from '@/components/Membership/MembershipList';
import CheckoutModal from '@/components/Membership/CheckoutModal';
import { useGetListMembershipPackagesQuery } from '@/services/membership/membershipApi';
import { useState } from 'react';

const Feature = ({ title, text, icon }) => {
  return (
    <Stack align='center' textAlign='center'>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'#3498DB'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize='lg'>
        {title}
      </Text>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </Stack>
  );
};

const HomePage = () => {
  const { data, isLoading, isError, error } = useGetListMembershipPackagesQuery(
    { page: 1, size: 3 }
  );
  const [page, setPage] = useState(1);
  const [size] = useState(3);
  const checkoutModal = useDisclosure();
  const [packageId, setPackageId] = useState(null);
  const [type, setType] = useState(null);

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
      {/* Hero Section */}
      <Box
        py={{ base: 10, md: 20 }}
        bg={useColorModeValue('#EBF8FF', 'gray.700')}
        borderRadius='lg'
        mb={10}
      >
        <Container maxW={'container.xl'}>
          <Stack
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            direction={{ base: 'column', md: 'row' }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 10 }}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
              >
                <Text as={'span'} position={'relative'} color={'#3498DB'}>
                  Track & Monitor
                </Text>
                <br />
                <Text as={'span'} color={'#2C3E50'}>
                  Your Child's Growth
                </Text>
              </Heading>
              <Text color={'gray.500'} fontSize={{ base: 'md', md: 'lg' }}>
                GrowthGuardian helps you track your child's development, get
                insights from growth charts, and share data with healthcare
                providers for personalized care and advice.
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Button
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  colorScheme={'blue'}
                  bg={'#3498DB'}
                  _hover={{ bg: '#2980B9' }}
                  as={RouterLink}
                  to='/register'
                >
                  Get Started
                </Button>
                <Button
                  rounded={'full'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  as={RouterLink}
                  to='/features'
                >
                  Learn More
                </Button>
              </Stack>
            </Stack>
            <Flex
              flex={1}
              justify={'center'}
              align={'center'}
              position={'relative'}
              w={'full'}
            >
              <Image
                alt={'Hero Image'}
                fit={'cover'}
                align={'center'}
                w={'100%'}
                h={'100%'}
                maxH={'500px'}
                src={
                  'https://images.unsplash.com/photo-1534614971-6be99a7a3ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                }
                borderRadius='lg'
              />
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <VStack spacing={20}>
        <Box width='full'>
          <VStack spacing={5} textAlign='center' mb={10}>
            <Heading as='h2' size='xl'>
              Main Features
            </Heading>
            <Text color={'gray.500'} maxW={'3xl'}>
              Our comprehensive platform provides essential tools for tracking
              and managing your child's growth development.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={10}>
            <Feature
              icon={<Icon as={FaChild} w={10} h={10} />}
              title={'Growth Tracking'}
              text={
                'Record weight, height, and other metrics easily and keep them organized in one secure place.'
              }
            />
            <Feature
              icon={<Icon as={FaChartLine} w={10} h={10} />}
              title={'Visual Charts'}
              text={
                'Access detailed growth charts that visualize development from infancy to adulthood.'
              }
            />
            <Feature
              icon={<Icon as={FaBell} w={10} h={10} />}
              title={'Smart Alerts'}
              text={
                'Get automatic notifications when growth patterns require attention.'
              }
            />
            <Feature
              icon={<Icon as={FaUserMd} w={10} h={10} />}
              title={'Doctor Portal'}
              text={
                'Share records with healthcare providers for professional guidance and feedback.'
              }
            />
            <Feature
              icon={<Icon as={FaUsers} w={10} h={10} />}
              title={'Multi-Child Support'}
              text={
                'Track multiple children with individualized profiles and comprehensive records.'
              }
            />
          </SimpleGrid>
        </Box>

        {/* Membership Plans Preview */}
        <Box
          width='full'
          py={10}
          bg={useColorModeValue('#F7FAFC', 'gray.700')}
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

          {data && (
            <MembershipList
              memberships={data.packages || []}
              currentPage={1}
              totalPages={data.totalPages || 1}
              onNext={handleNextPage}
              onPrev={handlePrevPage}
              onCheckout={openCheckoutModal}
              type='HOME'
            />
          )}
        </Box>
        <Box width={'full'}>
          <CheckoutModal
            isOpen={checkoutModal.isOpen}
            onClose={checkoutModal.onClose}
            packageId={packageId}
            type={type}
          />
        </Box>
        {/* Testimonials Section */}
        <Box width='full'>
          <VStack spacing={5} textAlign='center' mb={10}>
            <Heading as='h2' size='xl'>
              What Parents Say
            </Heading>
            <Text color={'gray.500'} maxW={'3xl'}>
              Join thousands of satisfied families tracking their children's
              growth with GrowthGuardian
            </Text>
          </VStack>

          {/* Add testimonials here */}
        </Box>

        {/* CTA Section */}
        <Box
          width='full'
          py={10}
          bg={useColorModeValue('#3498DB', '#2980B9')}
          borderRadius='lg'
        >
          <Stack spacing={0} align={'center'} textAlign='center' color='white'>
            <Heading as='h2' size='xl' mb={4}>
              Ready to track your child's growth?
            </Heading>
            <Text fontSize='lg' mb={6} maxW='2xl'>
              Join thousands of parents who trust GrowthGuardian for monitoring
              their children's development
            </Text>
            <Button
              rounded={'full'}
              px={6}
              py={6}
              bg={'white'}
              color={'#3498DB'}
              _hover={{ bg: 'gray.100' }}
              size='lg'
              as={RouterLink}
              to='/register'
            >
              Get Started Today
            </Button>
          </Stack>
        </Box>
      </VStack>
    </Box>
  );
};

export default HomePage;
