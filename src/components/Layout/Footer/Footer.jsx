import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Link,
  Image,
  IconButton,
  useColorModeValue,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Heading,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const bgColor = useColorModeValue('#f8f9fa', '#2C3E50');
  const textColor = useColorModeValue('#2C3E50', '#ECF0F1');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      color={textColor}
      borderTop={1}
      borderStyle={'solid'}
      borderColor={borderColor}
    >
      <Container as={Stack} maxW={'container.xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={'flex-start'}>
            <Heading as='h4' size='md' mb={2}>
              Company
            </Heading>
            <Link as={RouterLink} to='/about'>
              About Us
            </Link>
            <Link as={RouterLink} to='/contact'>
              Contact
            </Link>
          </Stack>

          <Stack align={'flex-start'}>
            <Heading as='h4' size='md' mb={2}>
              Resources
            </Heading>
            <Link as={RouterLink} to='/blog'>
              Blog
            </Link>
            <Link as={RouterLink} to='/faqs'>
              FAQs
            </Link>
          </Stack>

          <Stack align={'flex-start'}>
            <Heading as='h4' size='md' mb={2}>
              Membership
            </Heading>
            <Link as={RouterLink} to='/plans'>
              Pricing Plans
            </Link>
          </Stack>

          <Stack align={'flex-start'}>
            <Heading as='h4' size='md' mb={2}>
              Stay Connected
            </Heading>
            <Text>
              Subscribe to our newsletter for updates, tips, and resources.
            </Text>
            <InputGroup size='md' mt={2}>
              <Input
                pr='4.5rem'
                type='email'
                placeholder='Enter your email'
                bg={useColorModeValue('white', 'gray.700')}
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' colorScheme='blue'>
                  Join
                </Button>
              </InputRightElement>
            </InputGroup>
          </Stack>
        </SimpleGrid>
      </Container>

      {/* Phần bottom footer giữ nguyên */}
      <Box borderTopWidth={1} borderStyle={'solid'} borderColor={borderColor}>
        <Container
          as={Stack}
          maxW={'container.xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ md: 'space-between' }}
          align={{ md: 'center' }}
        >
          <Flex alignItems='center'>
            <Image
              src='/logo.svg'
              alt='GrowthGuardian Logo'
              boxSize='30px'
              fallbackSrc='https://via.placeholder.com/30x30?text=GG'
              mr={2}
            />
            <Text>
              © {new Date().getFullYear()} GrowthGuardian. All rights reserved
            </Text>
          </Flex>
          <Stack direction={'row'} spacing={6}>
            <IconButton
              aria-label='Facebook'
              icon={<FaFacebook />}
              size='sm'
              colorScheme='facebook'
              variant='ghost'
            />
            <IconButton
              aria-label='Twitter'
              icon={<FaTwitter />}
              size='sm'
              colorScheme='twitter'
              variant='ghost'
            />
            <IconButton
              aria-label='Instagram'
              icon={<FaInstagram />}
              size='sm'
              colorScheme='pink'
              variant='ghost'
            />
            <IconButton
              aria-label='YouTube'
              icon={<FaYoutube />}
              size='sm'
              colorScheme='red'
              variant='ghost'
            />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
