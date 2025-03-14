import { useLoginMutation } from '@/services/auth/authApi';
import InputField from './InputField';
import { login as loginSlice } from '@/services/auth/authSlice';
import { Box, Button, Center, VStack, useToast } from '@chakra-ui/react';
import { FastField, Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

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
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={async (data, { setSubmitting }) => {
          try {
            const result = await login(data).unwrap();
            console.log('Login response:', result); // Log the response to see its structure

            // Pass the accessToken directly
            dispatch(loginSlice({ accessToken: result.accessToken }));

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
            <Box as={Form} w={['full', '50%', '30%']} px={2}>
              <VStack>
                <FastField
                  component={InputField}
                  placeholder='Email'
                  label='Email'
                  name='email'
                  required={true}
                  mb={2}
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
                bg={'#74bc1f'}
                w='full'
              >
                Đăng nhập
              </Button>
            </Box>
          );
        }}
      </Formik>
    </Center>
  );
};

export default LoginForm;
