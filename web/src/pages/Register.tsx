import React, { useState } from 'react';
import {
  useRegisterMutation,
  useLoginMutation,
  useMeQuery,
  MeQuery,
  MeDocument,
  useCheckEmailMutation,
  UsersQuery,
  UsersDocument,
  useCheckInvitationMutation
} from '../generated/graphql';
import { Link as ReactLink, redirect, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
  Center,
  Box,
  FormControl,
  Input,
  Button,
  useToast,
  Text,
  Link,
  SimpleGrid,
  SlideFade,
  useDisclosure,
  Textarea
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { CropperModal } from '../components/register/CropperModal';
import { DropzoneComponent } from '../components/register/DropzoneComponent';
import * as EmailValidator from 'email-validator';

export const Register = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [originalData, setOriginalData] = useState('');
  const [cropData, setCropData] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [image, setImage] = useState([]);
  const [open, setOpen] = useState(false);
  const [checkEmail] = useCheckEmailMutation();

  const [isRegisterOpen, setIsRegisterOpen] = useState(true);
  const [register, { loading }] = useRegisterMutation();
  const [checkInvitation, { loading: checkInvitationLoading }] = useCheckInvitationMutation();
  const toast = useToast();

  const onCropperModalClose = () => {
    setOriginalData('');
    setOpen(false);
  };
  const navigate = useNavigate();

  return (
    <>
      <Center>
        <SimpleGrid columns={1} spacing="10px">
          {isOpen ? (
            <SlideFade in={isOpen}>
              <Box mb="10px">
                <Text fontSize="lg">
                  <b>Profile</b>
                </Text>
              </Box>
              <Box>
                <Formik
                  initialValues={{
                    username: '',
                    first: '',
                    last: '',
                    bio: ''
                  }}
                  onSubmit={async ({ username, first, last, bio }) => {
                    await register({
                      variables: {
                        email: loginEmail,
                        password: loginPassword,
                        profileImage: `${cropData ? cropData : ''}`,
                        ogProfileImage: `${cropData ? originalData : ''}`,
                        phone: phoneNumber,
                        verificationCode,
                        username: `${username ? username : ''}`,
                        first: `${first ? first : ''}`,
                        last: `${last ? last : ''}`,
                        bio: `${bio ? bio : ''}`
                      },
                      onCompleted: (data) => {
                        if (!data?.register.res) {
                          toast({
                            title: data?.register.message,
                            duration: 2000,
                            status: 'error',
                            position: 'top',
                            variant: 'subtle',
                            isClosable: true
                          });
                        } else {
                          navigate('/');
                          toast({
                            title: `Congradulations ${data.register.user?.profile?.first} 🎉 `,
                            description: `‎You're account ${data.register.user?.profile?.username} is registered.`,
                            status: 'success',
                            position: 'bottom',
                            variant: 'subtle',
                            isClosable: true
                          });
                        }
                      },
                      onError: (error) => {
                        console.log('ErrorPage', JSON.stringify(error, null, 2));
                      }
                    });
                  }}>
                  {({ handleChange, handleSubmit }) => (
                    <Form onSubmit={handleSubmit}>
                      <Center pb="10px">
                        <DropzoneComponent
                          cropData={cropData}
                          setCropData={setCropData}
                          setOpen={setOpen}
                          setImage={setImage}
                          setOriginalData={setOriginalData}
                        />
                      </Center>
                      <Box pb="10px">
                        <Text fontSize="xs">Username</Text>
                        <Input
                          name="username"
                          onChange={handleChange}
                          id="username"
                          w="250px"
                          placeholder="username"
                        />
                      </Box>
                      <Box pb="10px">
                        <Text fontSize="xs">First</Text>
                        <Input
                          id="first"
                          name="first"
                          onChange={handleChange}
                          placeholder="first"
                        />
                      </Box>
                      <Box pb="10px">
                        <Text fontSize="xs">Last</Text>
                        <Input id="last" name="last" placeholder="last" onChange={handleChange} />
                      </Box>
                      <Box pb="10px">
                        <Text fontSize="xs">Bio</Text>
                        <Textarea id="bio" name="bio" placeholder="bio" onChange={handleChange} />
                      </Box>
                      <Box pb="10px">
                        <Button
                          isLoading={loading}
                          type="submit"
                          colorScheme="pink"
                          variant="outline"
                          size="sm">
                          register
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Box>
            </SlideFade>
          ) : isRegisterOpen ? (
            <SlideFade in={isRegisterOpen}>
              <Box>
                <Text fontSize="lg" pb="10px">
                  <b>Register</b>
                </Text>
              </Box>

              <Box>
                <Formik
                  initialValues={{ email: '', password: '' }}
                  onSubmit={async ({ email, password }) => {
                    const valid = EmailValidator.validate(email);
                    if (!valid) {
                      toast({
                        title: 'Please enter a valid email address...',
                        duration: 3000,
                        status: 'error',
                        position: 'top',
                        variant: 'subtle',
                        isClosable: true
                      });
                      return;
                    }

                    if (!password) {
                      toast({
                        title: 'Please enter a valid password...',
                        duration: 3000,
                        status: 'error',
                        position: 'top',
                        variant: 'subtle',
                        isClosable: true
                      });
                      return;
                    }

                    const { data } = await checkEmail({
                      variables: { email }
                    });

                    setLoginEmail(email);
                    setLoginPassword(password);
                    onToggle();
                  }}>
                  {({ handleSubmit, handleChange }) => (
                    <Form onSubmit={handleSubmit}>
                      <Box pb="10px">
                        <Text fontSize="xs">Email</Text>
                        <Input
                          onChange={handleChange}
                          name="email"
                          id="email"
                          placeholder="email"
                        />
                      </Box>
                      <Box pb="10px">
                        <Text fontSize="xs">Password</Text>
                        <Input
                          name="password"
                          w="250px"
                          id="password"
                          placeholder="password"
                          type="password"
                          onChange={handleChange}
                        />
                      </Box>
                      <Box pb="10px">
                        <Button
                          rightIcon={<ArrowForwardIcon />}
                          type="submit"
                          colorScheme="pink"
                          variant="outline"
                          size="sm">
                          continue
                        </Button>
                      </Box>

                      {/* <Alert
                      status="success"
                      w="250px"
                      opacity={alertVisible ? 1 : 0}
                      transition={'0.3s'}>
                      <AlertIcon />
                      <Box flex="1">
                        <AlertTitle fontSize="sm">Congrats, you're in!</AlertTitle>
                        <CloseButton
                          onClick={() => setAlertVisible(false)}
                          position="absolute"
                          right="8px"
                          top="8px"
                        />
                      </Box>
                    </Alert> */}
                    </Form>
                  )}
                </Formik>
              </Box>
            </SlideFade>
          ) : (
            <>
              <Box>
                <Text fontSize="lg">
                  <b>Register </b>
                </Text>
              </Box>
              <Box>
                <Formik
                  initialValues={{ number: '', verificationCode: '' }}
                  onSubmit={async ({ number, verificationCode }) => {
                    const { data } = await checkInvitation({
                      variables: { number, verificationCode }
                    });
                    if (data && !data.checkInvitation.res) {
                      toast({
                        title: data.checkInvitation.message,
                        duration: 3000,
                        status: 'error',
                        position: 'top',
                        variant: 'subtle',
                        isClosable: true
                      });
                    } else {
                      setPhoneNumber(number);
                      setVerificationCode(verificationCode);
                      setIsRegisterOpen(true);
                    }
                  }}>
                  <Form>
                    <Box pb="10px">
                      <FormControl>
                        <Text fontSize="xs">Phone number</Text>
                        <Input id="number" name="number" placeholder="number" />
                      </FormControl>
                    </Box>
                    <Box pb="10px">
                      <FormControl>
                        <Text fontSize="xs">Invitation code</Text>
                        <Input
                          w="250px"
                          id="verificationCode"
                          name="verificationCode"
                          placeholder="code"
                        />
                      </FormControl>
                    </Box>
                    <Box pb="10px">
                      <Button
                        isLoading={checkInvitationLoading}
                        type="submit"
                        colorScheme="pink"
                        variant="outline"
                        size="sm">
                        Verify
                      </Button>
                    </Box>
                    <Text fontSize="sm">
                      Already have an account?{' '}
                      <Link
                        as={ReactLink}
                        to="/login"
                        color="teal.500"
                        _focus={{
                          boxShadow: 'none'
                        }}>
                        login
                      </Link>
                    </Text>
                  </Form>
                </Formik>
              </Box>
            </>
          )}
        </SimpleGrid>
      </Center>

      <CropperModal
        imageToBeCropped={image[0]}
        open={open}
        setOpen={setOpen}
        cropData={cropData}
        setCropData={setCropData}
        onClose={onCropperModalClose}
      />
    </>
  );
};
