import { useRegisterMutation } from '@/services/auth/authApi';
import InputField from './InputField';
import {
  Box,
  Button,
  Center,
  VStack,
  useToast,
  Text,
  Divider,
  HStack,
} from '@chakra-ui/react';
import { FastField, Form, Formik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import * as yup from 'yup';
import { useState } from 'react';

const SignupForm = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const toast = useToast();

  const validationSchema = yup.object().shape({
    name: yup.string().required('Vui lòng không bỏ trống'),
    email: yup
      .string()
      .email('Email không hợp lệ')
      .required('Vui lòng không bỏ trống'),
    password: yup
      .string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .required('Vui lòng không bỏ trống'),
  });

  return (
    <Center flex='1'>
      <Box w={['full', '50%', '30%']} px={2}>
        <VStack spacing={4}>
          <Text fontSize='2xl' fontWeight='bold'>
            Đăng ký
          </Text>

          {/* Divider */}
          <HStack w='full' my={4}>
            <Divider />
            <Text fontSize='sm' color='gray.500' whiteSpace='nowrap' px={2}>
              SIGN UP WITH EMAIL
            </Text>
            <Divider />
          </HStack>

          {/* Signup Form */}
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              name: '',
              email: '',
              password: '',
            }}
            onSubmit={async (data, { setSubmitting }) => {
              try {
                await register(data).unwrap();
                toast({
                  title: 'Đăng ký thành công',
                  status: 'success',
                  duration: 1000,
                  isClosable: true,
                  position: 'top-right',
                  onCloseComplete: () => {
                    navigate('/login');
                  },
                });
              } catch (err) {
                toast({
                  title: err.data?.message || 'Đăng ký thất bại',
                  status: 'error',
                  duration: 2500,
                  isClosable: true,
                  position: 'top-right',
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {formikProps => (
              <Box as={Form} w='full'>
                <VStack spacing={4}>
                  <FastField
                    component={InputField}
                    placeholder='Tên'
                    label='Họ và tên'
                    name='name'
                    required
                  />
                  <FastField
                    component={InputField}
                    placeholder='Email'
                    label='Email'
                    name='email'
                    required
                  />
                  <FastField
                    component={InputField}
                    placeholder='Mật khẩu'
                    label='Mật khẩu'
                    name='password'
                    type='password'
                    required
                  />
                </VStack>
                <Button
                  mt={4}
                  disabled={formikProps.isSubmitting || isLoading}
                  isLoading={formikProps.isSubmitting || isLoading}
                  type='submit'
                  bg={'#3498DB'}
                  color='white'
                  w='full'
                >
                  Đăng ký
                </Button>
              </Box>
            )}
          </Formik>

          {/* Login Link */}
          <Text mt={2} textAlign='center' fontSize='sm' color='gray.600'>
            Already have an account?{' '}
            <Link to='/login' style={{ color: '#3498DB', fontWeight: 'bold' }}>
              Login
            </Link>
          </Text>
        </VStack>
      </Box>
    </Center>
  );
};

export default SignupForm;
