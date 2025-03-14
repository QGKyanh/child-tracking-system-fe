import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

const MainLayout = () => {
  return (
    <Box display='flex' flexDirection='column' minHeight='100vh'>
      <Navbar />
      <Box flex='1' as='main'>
        <Container
          maxW='container.xl'
          py={{ base: 4, md: 8 }}
          px={{ base: 4, md: 6 }}
        >
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
