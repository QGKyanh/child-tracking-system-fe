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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FaChild,
  FaChartLine,
  FaBell,
  FaUserMd,
  FaUsers,
} from 'react-icons/fa';

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

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={10}
            px={{ base: 5, md: 10 }}
          >
            {/* Basic Plan */}
            <Box
              maxW={'330px'}
              w={'full'}
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow={'2xl'}
              rounded={'md'}
              overflow={'hidden'}
              mx='auto'
            >
              <Box p={6}>
                <Stack spacing={0} align={'center'} mb={5}>
                  <Heading size='md' fontWeight={500}>
                    Basic
                  </Heading>
                  <Text color={'gray.500'}>Essential tracking features</Text>
                </Stack>

                <Stack
                  direction={'row'}
                  align={'center'}
                  justify={'center'}
                  mb={5}
                >
                  <Text fontWeight={800} fontSize={'3xl'}>
                    $5
                  </Text>
                  <Text color={'gray.500'}>/month</Text>
                </Stack>

                <VStack spacing={2} mb={5}>
                  <Text>✓ Growth tracking for one child</Text>
                  <Text>✓ Basic growth charts</Text>
                  <Text>✓ Data export (CSV)</Text>
                  <Text color='gray.500'>✗ Multi-child support</Text>
                  <Text color='gray.500'>✗ Doctor sharing</Text>
                </VStack>

                <Button
                  w={'full'}
                  mt={8}
                  bg={useColorModeValue('#3498DB', '#3498DB')}
                  color={'white'}
                  rounded={'md'}
                  _hover={{
                    bg: '#2980B9',
                  }}
                  as={RouterLink}
                  to='/plans/basic'
                >
                  Start Free Trial
                </Button>
              </Box>
            </Box>

            {/* Premium Plan */}
            <Box
              maxW={'330px'}
              w={'full'}
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow={'2xl'}
              rounded={'md'}
              overflow={'hidden'}
              mx='auto'
              border='2px'
              borderColor='#3498DB'
            >
              <Box bg='#3498DB' px={6} py={2}>
                <Text color='white' fontWeight='bold' textAlign='center'>
                  MOST POPULAR
                </Text>
              </Box>
              <Box p={6}>
                <Stack spacing={0} align={'center'} mb={5}>
                  <Heading size='md' fontWeight={500}>
                    Premium
                  </Heading>
                  <Text color={'gray.500'}>Complete family solution</Text>
                </Stack>

                <Stack
                  direction={'row'}
                  align={'center'}
                  justify={'center'}
                  mb={5}
                >
                  <Text fontWeight={800} fontSize={'3xl'}>
                    $15
                  </Text>
                  <Text color={'gray.500'}>/month</Text>
                </Stack>

                <VStack spacing={2} mb={5}>
                  <Text>✓ Growth tracking for up to 5 children</Text>
                  <Text>✓ Advanced growth charts</Text>
                  <Text>✓ Growth predictions</Text>
                  <Text>✓ Doctor data sharing</Text>
                  <Text>✓ Smart alerts</Text>
                </VStack>

                <Button
                  w={'full'}
                  mt={8}
                  bg={'#27AE60'}
                  color={'white'}
                  rounded={'md'}
                  _hover={{
                    bg: '#219653',
                  }}
                  as={RouterLink}
                  to='/plans/premium'
                >
                  Start Free Trial
                </Button>
              </Box>
            </Box>

            {/* Professional Plan */}
            <Box
              maxW={'330px'}
              w={'full'}
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow={'2xl'}
              rounded={'md'}
              overflow={'hidden'}
              mx='auto'
            >
              <Box p={6}>
                <Stack spacing={0} align={'center'} mb={5}>
                  <Heading size='md' fontWeight={500}>
                    Professional
                  </Heading>
                  <Text color={'gray.500'}>For healthcare providers</Text>
                </Stack>

                <Stack
                  direction={'row'}
                  align={'center'}
                  justify={'center'}
                  mb={5}
                >
                  <Text fontWeight={800} fontSize={'3xl'}>
                    $30
                  </Text>
                  <Text color={'gray.500'}>/month</Text>
                </Stack>

                <VStack spacing={2} mb={5}>
                  <Text>✓ All Premium features</Text>
                  <Text>✓ Unlimited patients</Text>
                  <Text>✓ Clinical reports</Text>
                  <Text>✓ Analytics dashboard</Text>
                  <Text>✓ Professional support</Text>
                </VStack>

                <Button
                  w={'full'}
                  mt={8}
                  bg={useColorModeValue('#8E44AD', '#8E44AD')}
                  color={'white'}
                  rounded={'md'}
                  _hover={{
                    bg: '#7D3C98',
                  }}
                  as={RouterLink}
                  to='/plans/professional'
                >
                  Contact Sales
                </Button>
              </Box>
            </Box>
          </SimpleGrid>
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
