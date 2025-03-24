import React from 'react';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Heading } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/services/auth/authSlice';
import ProfileDetails from '@/components/User/ProfileDetails';
import { Link as RouterLink } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';

const ProfilePage = () => {
  const storedUser = useSelector(selectCurrentUser);

  return (
    <Box p={6} maxW='container.lg' mx='auto'>
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
          <BreadcrumbLink>Profile</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      
      <Heading as='h1' size='xl' mb={6}>
        Profile
      </Heading>
     
      <ProfileDetails user={storedUser} />
    </Box>
  );
};

export default ProfilePage;
