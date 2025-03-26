import React, { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Badge,
  SimpleGrid,
  Image,
  Button,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { useUpdateUserMutation } from '@/services/user/userApi';
import { useChangePasswordMutation, useLogoutMutation } from '@/services/auth/authApi';
import { FaUserCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { logout, setUser } from '@/services/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReceiptList from './ReceiptList';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/services/auth/authSlice';
const ProfileDetails = ({ user }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const storeUser = useSelector(selectCurrentUser);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    avatar: null,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const formatDate = dateString => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = e => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
    }
  };

  const togglePasswordVisibility = field => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdate = async () => {
    try {
      const updatedData = new FormData();
      updatedData.append('id', user._id);
      updatedData.append('name', formData.name);
      updatedData.append('phoneNumber', formData.phoneNumber);
      if (formData.avatar) {
        updatedData.append('avatar', formData.avatar, 'avatar');
      }

      const response = await updateUser(updatedData).unwrap();
      dispatch(setUser(response.user));
      toast({
        title: 'Profile Updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      console.log(err);
      toast({
        title: 'Error',
        description: err.data?.message || 'Failed to update profile.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      toast({
        title: 'Password Changed',
        description: 'Password updated successfully. Logging out...',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      const result = await logoutMutation().unwrap();
      dispatch(logout());
      navigate('/login')
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to change password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box textAlign='center'>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <VStack spacing={4} align='stretch'>
          <Box
            p={4}
            borderWidth={1}
            borderRadius='lg'
            bg='gray.50'
            display={'flex'}
            gap={4}
            flexDirection={'column'}
          >
            <Box display='flex' justifyContent='center'>
              <Image
                src={user?.avatar}
                fallback={
                  <Icon as={FaUserCircle} boxSize='200px' color='gray.300' />
                }
                alt='User avatar'
                maxW='200px'
                borderRadius='md'
              />
            </Box>
            <Box>
              <Text fontSize='2xl' fontWeight='bold' color='teal.600'>
                {user?.name || 'N/A'}
              </Text>
            </Box>
            <Box>
              <Text>{user?.email || 'N/A'}</Text>
            </Box>
            <Box>
              <Text>{user?.phoneNumber || 'N/A'}</Text>
            </Box>
            <Box>
              <Badge colorScheme={user?.isDeleted ? 'red' : 'green'}>
                {user?.isDeleted ? 'Deleted' : 'Active'}
              </Badge>
            </Box>
            <Button
              colorScheme='teal'
              onClick={onOpen}
              isDisabled={user?.isDeleted}
              w='full'
            >
              Edit Profile
            </Button>
          </Box>
          {/* Change Password Box */}
          <Box p={4} borderWidth={1} borderRadius='lg' bg='gray.50'>
            <Text fontWeight='bold' mb={2}>
              Change Password
            </Text>
            <VStack spacing={3}>
              <FormControl>
                <FormLabel>Old Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPasswords.oldPassword ? 'text' : 'password'}
                    name='oldPassword'
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                  />
                  <InputRightElement>
                    <IconButton
                      variant='ghost'
                      icon={
                        showPasswords.oldPassword ? <FaEyeSlash /> : <FaEye />
                      }
                      onClick={() => togglePasswordVisibility('oldPassword')}
                      aria-label={
                        showPasswords.oldPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    name='newPassword'
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <InputRightElement>
                    <IconButton
                      variant='ghost'
                      icon={
                        showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />
                      }
                      onClick={() => togglePasswordVisibility('newPassword')}
                      aria-label={
                        showPasswords.newPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={
                      showPasswords.confirmNewPassword ? 'text' : 'password'
                    }
                    name='confirmNewPassword'
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                  />
                  <InputRightElement>
                    <IconButton
                      variant='ghost'
                      icon={
                        showPasswords.confirmNewPassword ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )
                      }
                      onClick={() =>
                        togglePasswordVisibility('confirmNewPassword')
                      }
                      aria-label={
                        showPasswords.confirmNewPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                colorScheme='teal'
                onClick={handleChangePassword}
                isLoading={isChangingPassword}
                loadingText='Changing'
                w='full'
              >
                Change Password
              </Button>
            </VStack>
          </Box>
        </VStack>
        {storeUser?.role === 0 && (
          <VStack spacing={6} align='stretch'>
            {/* Subscription Box */}
            <Box
              p={6}
              borderWidth={1}
              borderRadius='lg'
              bg='white'
              boxShadow='md'
            >
              <Text fontSize='xl' fontWeight='bold' mb={4} color='teal.600'>
                Membership Details
              </Text>

              {user?.subscription?.currentPlan ? (
                <VStack align='stretch' spacing={4}>
                  {/* Plan Card */}
                  <Box
                    p={4}
                    borderWidth={1}
                    borderRadius='md'
                    borderColor='teal.200'
                    bg='teal.50'
                  >
                    <Text fontSize='lg' fontWeight='semibold' color='teal.700'>
                      {user.subscription.currentPlanDetails?.name}
                    </Text>
                    <Text mt={1} color='gray.600'>
                      {user.subscription.currentPlanDetails?.description}
                    </Text>

                    <Box mt={3} display='flex' justifyContent='space-between'>
                      <Box>
                        <Text fontSize='sm' color='gray.500'>
                          Price
                        </Text>
                        <Text fontWeight='medium'>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(
                            user.subscription.currentPlanDetails?.price?.value
                          )}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize='sm' color='gray.500'>
                          Duration
                        </Text>
                        <Text fontWeight='medium'>
                          {
                            user.subscription.currentPlanDetails?.duration
                              ?.value
                          }{' '}
                          {user.subscription.currentPlanDetails?.duration?.unit?.toLowerCase()}
                        </Text>
                      </Box>
                    </Box>
                  </Box>

                  {/* Validity Period */}
                  <Box
                    p={3}
                    bg='gray.50'
                    borderRadius='md'
                    borderLeftWidth={4}
                    borderLeftColor='teal.400'
                  >
                    <Text fontSize='sm' fontWeight='semibold' mb={1}>
                      Active Period
                    </Text>
                    <Box display='flex' justifyContent='space-between'>
                      <Box>
                        <Text fontSize='xs' color='gray.500'>
                          Start Date
                        </Text>
                        <Text fontSize='sm'>
                          {formatDate(user.subscription.startDate)}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize='xs' color='gray.500'>
                          End Date
                        </Text>
                        <Text fontSize='sm'>
                          {formatDate(user.subscription.endDate)}
                        </Text>
                      </Box>
                    </Box>
                  </Box>

                  {/* Features */}
                  <Box mt={2}>
                    <Text fontSize='sm' fontWeight='semibold' mb={2}>
                      Plan Features
                    </Text>
                    <SimpleGrid columns={2} spacing={2}>
                      <Box>
                        <Text fontSize='xs' color='gray.500'>
                          Post Limit
                        </Text>
                        <Text fontSize='sm' fontWeight='medium'>
                          {user.subscription.currentPlanDetails?.postLimit ||
                            'Unlimited'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize='xs' color='gray.500'>
                          Updates Limit
                        </Text>
                        <Text fontSize='sm' fontWeight='medium'>
                          {user.subscription.currentPlanDetails
                            ?.updateChildDataLimit || 'Unlimited'}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  <Text fontSize='xl' fontWeight='bold' mb={4} color='teal.600'>
                    Future Plan Details
                  </Text>
                  {user?.subscription?.futurePlan ? (
                    <>
                      {/* Plan Card */}
                      <Box
                        p={4}
                        borderWidth={1}
                        borderRadius='md'
                        borderColor='teal.200'
                        bg='teal.50'
                      >
                        <Text
                          fontSize='lg'
                          fontWeight='semibold'
                          color='teal.700'
                        >
                          {user.subscription.futurePlanDetails?.name}
                        </Text>
                        <Text mt={1} color='gray.600'>
                          {user.subscription.futurePlanDetails?.description}
                        </Text>

                        <Box
                          mt={3}
                          display='flex'
                          justifyContent='space-between'
                        >
                          <Box>
                            <Text fontSize='sm' color='gray.500'>
                              Price
                            </Text>
                            <Text fontWeight='medium'>
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(
                                user.subscription.futurePlanDetails?.price
                                  ?.value
                              )}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize='sm' color='gray.500'>
                              Duration
                            </Text>
                            <Text fontWeight='medium'>
                              {
                                user.subscription.futurePlanDetails?.duration
                                  ?.value
                              }{' '}
                              {user.subscription.futurePlanDetails?.duration?.unit?.toLowerCase()}
                            </Text>
                          </Box>
                        </Box>
                      </Box>

                      {/* Features */}
                      <Box mt={2}>
                        <Text fontSize='sm' fontWeight='semibold' mb={2}>
                          Plan Features
                        </Text>
                        <SimpleGrid columns={2} spacing={2}>
                          <Box>
                            <Text fontSize='xs' color='gray.500'>
                              Post Limit
                            </Text>
                            <Text fontSize='sm' fontWeight='medium'>
                              {user.subscription.futurePlanDetails?.postLimit ||
                                'Unlimited'}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize='xs' color='gray.500'>
                              Updates Limit
                            </Text>
                            <Text fontSize='sm' fontWeight='medium'>
                              {user.subscription.futurePlanDetails
                                ?.updateChildDataLimit || 'Unlimited'}
                            </Text>
                          </Box>
                        </SimpleGrid>
                      </Box>
                    </>
                  ) : (
                    <Box textAlign='center' py={4}>
                      <Text color='gray.500' mb={4}>
                        You don't have an any future membership plan
                      </Text>
                    </Box>
                  )}
                </VStack>
              ) : (
                <Box textAlign='center' py={4}>
                  <Text color='gray.500' mb={4}>
                    You don't have an active membership
                  </Text>
                  <Button colorScheme='teal' size='sm'>
                    Upgrade Now
                  </Button>
                </Box>
              )}
            </Box>
          </VStack>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    name='phoneNumber'
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Avatar</FormLabel>
                  <Input
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                    p={1}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant='ghost' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme='teal'
                onClick={handleUpdate}
                isLoading={isUpdating}
                loadingText='Updating'
              >
                Save Changes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </SimpleGrid>
      {storeUser?.role === 1 && (
        <ReceiptList userId={user?._id} toast={toast} />
      )}
    </Box>
  );
};

export default ProfileDetails;
