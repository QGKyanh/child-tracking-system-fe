import { useLoginMutation } from '@/services/auth/authApi';
import InputField from './InputField';
import { login as loginSlice } from '@/services/auth/authSlice';
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
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import * as yup from 'yup';
import GoogleLoginButton from '@/components/GoogleAuth/GoogleLoginButton';

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  const validationSchema = yup.object().shape({
    email: yup.string().required('Vui lòng không bỏ trống'),
    password: yup.string().required('Vui lòng không bỏ trống'),
  });

  return (
    <Center flex='1'>
      <Box w={['full', '50%', '30%']} px={2}>
        <VStack spacing={4}>
          {/* Google Login Button */}
          <GoogleLoginButton />

          {/* Divider */}
          <HStack w='full' my={4}>
            <Divider />
            <Text fontSize='sm' color='gray.500' whiteSpace='nowrap' px={2}>
              OR LOGIN WITH EMAIL
            </Text>
            <Divider />
          </HStack>

          {/* Traditional Login Form */}
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={async (data, { setSubmitting }) => {
              try {
                const result = await login(data).unwrap();
                console.log('Login response:', result);

                // Store the access token
                dispatch(loginSlice({ accessToken: result.accessToken }));

                // Manually trigger a refetch of user info
                dispatch({ type: 'api/invalidateTags', payload: ['Auth'] });

                toast({
                  title: 'Đăng nhập thành công',
                  status: 'success',
                  duration: 1000,
                  isClosable: true,
                  position: 'top-right',
                  onCloseComplete: () => {
                    navigate('/');
                  },
                });
              } catch (err) {
                console.log('Login error: ', err);
                toast({
                  title: err.data?.message || 'Đăng nhập thất bại',
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
            {formikProps => {
              return (
                <Box as={Form} w='full'>
                  <VStack spacing={4}>
                    <FastField
                      component={InputField}
                      placeholder='Email'
                      label='Email'
                      name='email'
                      required={true}
                    />
                    <FastField
                      component={InputField}
                      placeholder='Mật khẩu'
                      label='Mật khẩu'
                      name='password'
                      type='password'
                      required={true}
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
                    Đăng nhập
                  </Button>
                </Box>
              );
            }}
          </Formik>

          {/* Register Link */}
          <Text mt={2} textAlign='center' fontSize='sm' color='gray.600'>
            Don't have an account?{' '}
            <Link
              to='/register'
              style={{ color: '#3498DB', fontWeight: 'bold' }}
            >
              Sign up
            </Link>
          </Text>

          {/* Forgot Password Link */}
          {/* <Text textAlign='center' fontSize='sm' color='gray.600'>
            <Link to='/forgot-password' style={{ color: '#3498DB' }}>
              Forgot your password?
            </Link>
          </Text> */}
        </VStack>
      </Box>
    </Center>
  );
};

export default LoginForm;
