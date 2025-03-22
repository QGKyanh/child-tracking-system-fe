import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  IconButton,
  Collapse,
  useDisclosure,
  useColorModeValue,
  Image,
  Container,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectCurrentUser,
} from '@/services/auth/authSlice';

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const userRole = user?.role;

  const baseNavItems = [
    ...(userRole !== 2
      ? [
          { label: 'Home', href: '/' },
          {
            label: 'Features',
            children: [
              {
                label: 'Growth Tracking',
                subLabel: "Track your child's growth metrics",
                href: '/features/growth-tracking',
              },
              {
                label: 'Growth Charts',
                subLabel: 'Visualize development progress',
                href: '/features/growth-charts',
              },
              {
                label: 'Data Sharing',
                subLabel: 'Share with healthcare providers',
                href: '/features/data-sharing',
              },
            ],
          },
          { label: 'Membership Plans', href: '/plans' },
          {
            label: 'Resources',
            children: [
              { label: 'Blog', subLabel: 'Latest articles on child development', href: '/blog' },
              { label: 'FAQs', subLabel: 'Common questions and answers', href: '/faqs' },
              { label: 'User Guide', subLabel: 'How to use the platform', href: '/user-guide' },
            ],
          },
          { label: 'Contact', href: '/contact' },
        ]
      : [
          { label: 'Doctor Requests', href: '/doctor/requests' },
          { label: 'Doctor Consultations', href: '/doctor/consultations' },
          { label: 'Blog', href: '/blog' },
        ]),
  ];


  const bgColor = useColorModeValue('#ffffff', '#283747');
  const textColor = useColorModeValue('#2C3E50', '#ECF0F1');
  const primaryColor = '#3498DB';
  const accentColor = '#27AE60';

  return (
    <Box position='sticky' top='0' zIndex='sticky' bg={bgColor} boxShadow='sm'>
      <Container maxW='container.xl'>
        <Flex color={textColor} minH={'60px'} py={{ base: 2 }} px={{ base: 4 }} align={'center'} justify='space-between'>
          <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>

          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <RouterLink to='/'>
              <Flex align='center'>
                <Image src='src/assets/react.svg' alt='GrowthGuardian Logo' boxSize='40px' fallbackSrc='https://via.placeholder.com/40x40?text=GG' />
                <Text ml={2} fontFamily={'heading'} fontWeight='bold' color={textColor}>GrowthGuardian</Text>
              </Flex>
            </RouterLink>
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav navItems={baseNavItems} />
            </Flex>
          </Flex>

          <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6}>
            {isAuthenticated ? (
              <Menu>
                <MenuButton as={Button} variant='ghost' p={0}>
                  <Avatar size='sm' name={user?.name || 'User'} src={user?.avatar || undefined} />
                </MenuButton>
                <MenuList>
                  {userRole !== 2 && (
                    <MenuItem as={RouterLink} to='/dashboard'>Dashboard</MenuItem>
                  )}
                  <MenuItem as={RouterLink} to='/profile'>My Profile</MenuItem>
                  {userRole !== 2 && (
                    <MenuItem as={RouterLink} to='/children'>My Children</MenuItem>
                  )}
                  <MenuItem as={RouterLink} to='/settings'>Settings</MenuItem>
                  <MenuItem as={RouterLink} to='/logout'>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <>
                <Button as={RouterLink} to='/login' fontSize={'sm'} fontWeight={400} variant={'outline'} colorScheme='blue'>Sign In</Button>
                <Button as={RouterLink} to='/register' display={{ base: 'none', md: 'inline-flex' }} fontSize={'sm'} fontWeight={600} color={'white'} bg={primaryColor} _hover={{ bg: `${accentColor}` }}>Sign Up</Button>
              </>
            )}
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav navItems={baseNavItems} />
        </Collapse>
      </Container>
    </Box>
  );
};

const DesktopNav = ({ navItems }) => {
  const linkColor = useColorModeValue('#2C3E50', '#ECF0F1');
  const linkHoverColor = useColorModeValue('#3498DB', '#3498DB');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4} align='center'>
      {navItems.map(navItem => (
        <Box key={navItem.label}>
          {navItem.children ? (
            <Menu>
              <MenuButton as={Button} variant='ghost' p={2} fontWeight={500} color={linkColor} rightIcon={<ChevronDownIcon />}>
                {navItem.label}
              </MenuButton>
              <MenuList bg={popoverContentBgColor}>
                {navItem.children.map(child => (
                  <MenuItem key={child.label} as={RouterLink} to={child.href}>
                    <Box>
                      <Text fontWeight={500}>{child.label}</Text>
                      <Text fontSize={'sm'} opacity={0.8}>{child.subLabel}</Text>
                    </Box>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ) : (
            <Box as={RouterLink} to={navItem.href} p={2} fontSize={'sm'} fontWeight={500} color={linkColor} _hover={{ textDecoration: 'none', color: linkHoverColor }}>
              {navItem.label}
            </Box>
          )}
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = ({ navItems }) => {
  return (
    <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
      {navItems.map(navItem => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex py={2} as={RouterLink} to={href ?? '#'} justify={'space-between'} align={'center'} _hover={{ textDecoration: 'none' }}>
        <Text fontWeight={600} color={useColorModeValue('#2C3E50', 'gray.200')}>{label}</Text>
        {children && (
          <IconButton
            icon={<ChevronDownIcon />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            transition={'all .25s ease-in-out'}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map(child => (
              <Box as={RouterLink} key={child.label} py={2} to={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default Navbar;
