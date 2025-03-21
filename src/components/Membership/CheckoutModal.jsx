import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
  Spinner,
  Flex,
  Box,
  Heading,
  Highlight,
  Button,
  Text,
  Stack,
  Grid,
  Select,
  Image,
  RadioGroup,
  Radio,
  useToast,
} from '@chakra-ui/react';
import { useGetMembershipPackageByIdQuery } from '@/services/membership/membershipApi';
import {
  useCreatePayPalPaymentMutation,
  useCreateVNPayPaymentMutation,
} from '@/services/payment/paymentApi';
export default function CheckoutModal({
  isOpen,
  onClose,
  packageId = null,
  type,
}) {
  const [createVNPayPayment] = useCreateVNPayPaymentMutation();
  const [createPayPalPayment] = useCreatePayPalPaymentMutation();
  const toast = useToast();
  const {
    data: membershipReponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMembershipPackageByIdQuery(
    { id: packageId },
    {
      skip: !isOpen || !packageId,
    }
  );
  const membership = membershipReponse?.package;
  const [method, setMethod] = useState(null);
  const handleSubmit = async () => {
    let formatedPrice = membership.price.value;
    if (method === 'vnpay' && membership.price.unit === 'USD') {
      formatedPrice = parseFloat((formatedPrice * 25000).toFixed(2));
    }

    if (method === 'paypal' && membership.price.unit === 'VND') {
      formatedPrice = parseFloat((formatedPrice / 25000).toFixed(2));
    }

    console.log(formatedPrice);
    const data = {
      price: formatedPrice,
      packageId: membership._id.toString(),
      purchaseType: type,
    };

    console.log(data);
    let response;
    if (method === 'vnpay') {
      response = await createVNPayPayment(data);
    } else if (method === 'paypal') {
      response = await createPayPalPayment(data);
    } else {
      toast({
        title: 'Payment Failed.',
        description: 'Invalid payment method',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
    if (response?.data?.link) {
      window.location.href = response.data.link;
    }
    if (response?.error?.status !== 200) {
      toast({
        title: 'Payment Failed.',
        description: `${response.error.data.message}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    if (isOpen && packageId) {
      refetch();
    }
  }, [isOpen, packageId, refetch]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Membership Package Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center py={10}>
              <Spinner size='xl' color='blue.500' />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Membership Package Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status='error'>
              <AlertIcon />
              Failed to load membership package details:{' '}
              {error?.data?.message || 'Unknown error'}
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justify='space-between' align='center'>
              <Heading>Checkout</Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns='repeat(2, 1fr)' gap={6} p={10}>
              <Box
                bg='gray.50'
                p={2}
                color='blackAlpha.700'
                borderRadius='md'
                shadow='sm'
              >
                <Heading>Product</Heading>
                <Stack spacing={2} mt={4}>
                  <Text fontWeight={700}>{membership?.name}</Text>
                  <Text mt={2}>{membership.description}</Text>
                  <Text>Posts Allowed: {membership.postLimit}</Text>
                  <Text>
                    Growth Data Entries: {membership.updateChildDataLimit}
                  </Text>
                  <Text>Downloadable Charts: {membership.downloadChart}</Text>
                </Stack>
              </Box>
              <Box p={2} color='black' borderRadius='md' shadow='sm'>
                <Heading>Total</Heading>
                <Stack direction='row' p={2} justifyContent={'space-between'}>
                  <Text> Subtotal:</Text>
                  <Text>
                    {membership.price.unit === 'USD'
                      ? `$${membership.price.value}`
                      : `${membership.price.value}VNĐ`}
                  </Text>
                </Stack>
                <Stack direction='row' p={5} justifyContent={'space-between'}>
                  <Text> Quantity:</Text>
                  <Text>1</Text>
                </Stack>
                <Stack direction='row' p={5} justifyContent={'space-between'}>
                  <Text>Payment method:</Text>
                </Stack>
                <Stack direction={'row'}>
                  <RadioGroup onChange={setMethod} value={method}>
                    <Stack direction='row' gap={10}>
                      <Radio value='vnpay'>
                        <Stack direction='row'>
                          <Image
                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp1v7T287-ikP1m7dEUbs2n1SbbLEqkMd1ZA&s'
                            alt='vnpay'
                            w={25}
                            h={25}
                          />
                          <Text>VNPay</Text>
                        </Stack>
                      </Radio>
                      <Radio value='paypal'>
                        {' '}
                        <Stack direction='row'>
                          <Image
                            src='https://rgb.vn/wp-content/uploads/2014/05/rgb_vn_new_branding_paypal_2014_logo_detail.png'
                            alt='paypal'
                            w={25}
                            h={25}
                          />
                          <Text>PayPal</Text>
                        </Stack>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </Stack>
                <Stack flexDirection='row' justifyContent={'flex-end'} mt={5}>
                  <Button w={200} colorScheme='green' onClick={handleSubmit}>
                    Confirm
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
