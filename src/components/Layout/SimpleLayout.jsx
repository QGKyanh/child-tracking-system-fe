import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const SimpleLayout = () => {
  return (
    <Box minH='100vh' display='flex' flexDirection='column'>
      <Container maxW='container.xl' flex={1} py={4}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default SimpleLayout;
