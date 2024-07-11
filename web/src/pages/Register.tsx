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
import { Link as ReactLink, redirect } from 'react-router-dom';
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
  Textarea,
  Alert,
  AlertTitle,
  AlertIcon,
  CloseButton
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { setAccessToken } from '../accessToken';
import { CropperModal } from '../components/register/CropperModal';
import { DropzoneComponent } from '../components/register/DropzoneComponent';

export const Register = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { data: me } = useMeQuery();
  const [alertVisible, setAlertVisible] = useState(true);
  const [originalData, setOriginalData] = useState('');
  const [cropData, setCropData] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [image, setImage] = useState([]);
  const [open, setOpen] = useState(false);

  const [registrationLoading, setRegistrationLoading] = useState(false);

  const [checkEmail] = useCheckEmailMutation();

  if (me && me.me) {
    redirect('/');
  }
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [register, { error }] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [checkInvitation, { loading: checkInvitationLoading }] = useCheckInvitationMutation();
  const toast = useToast();

  const onCropperModalClose = () => {
    setOriginalData('');
    setOpen(false);
  };

  if (error) {
    return (
      <>
        <Text>image uploading failed</Text>
      </>
    );
  }

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
                    setRegistrationLoading(true);
                    const { data } = await register({
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
                      update: (store, { data }) => {
                        const old = store.readQuery<UsersQuery>({
                          query: UsersDocument
                        });
                        if (!data || !old) {
                          return null;
                        }
                        if (data.register.user) {
                          store.writeQuery<UsersQuery>({
                            query: UsersDocument,
                            data: {
                              __typename: 'Query',
                              users: [...old.users, data.register.user]
                            }
                          });
                        }
                      }
                    });

                    if (data?.register.res) {
                      toast({
                        title: data.register.message,
                        duration: 2000,
                        status: 'error',
                        position: 'top',
                        variant: 'subtle',
                        isClosable: true
                      });
                    } else {
                      const response = await login({
                        variables: {
                          email: loginEmail,
                          password: loginPassword
                        },
                        update: (store, { data }) => {
                          if (!data) {
                            return null;
                          }
                          store.writeQuery<MeQuery>({
                            query: MeDocument,
                            data: {
                              __typename: 'Query',
                              me: data.login.user
                            }
                          });
                        }
                      });
                      if (!response.data) {
                        toast({
                          title: `Something went wrong! Please try again...`,
                          status: 'error',
                          position: 'top',
                          variant: 'subtle',
                          isClosable: true
                        });
                      }
                      if (response && response.data) {
                        setAccessToken(response.data.login.accessToken);
                        redirect('/');
                        toast({
                          title: `Congradulations ${response?.data.login.user.profile?.first} 🎉 `,
                          description: `‎You're account ${response.data.login.user.profile?.username} is registered.`,
                          status: 'success',
                          position: 'bottom',
                          variant: 'subtle',
                          isClosable: true
                        });
                      }
                    }
                    setRegistrationLoading(false);
                  }}>
                  <Form>
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
                      <FormControl>
                        <Text fontSize="xs">Username</Text>
                        <Input name="username" id="username" w="250px" placeholder="username" />
                      </FormControl>
                    </Box>
                    <Box pb="10px">
                      <FormControl>
                        <Text fontSize="xs">First</Text>
                        <Input id="first" name="first" placeholder="first" />
                      </FormControl>
                    </Box>
                    <Box pb="10px">
                      <FormControl>
                        <Text fontSize="xs">Last</Text>
                        <Input id="last" name="last" placeholder="last" />
                      </FormControl>
                    </Box>
                    <Box pb="10px">
                      <FormControl>
                        <Text fontSize="xs">Bio</Text>
                        <Textarea id="bio" name="bio" placeholder="bio" />
                      </FormControl>
                    </Box>
                    <Box pb="10px">
                      <Button
                        isLoading={registrationLoading}
                        type="submit"
                        colorScheme="pink"
                        variant="outline"
                        size="sm">
                        register
                      </Button>
                    </Box>
                  </Form>
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
                    const valid = email.match(/^\S+@\S+\.\S+$/g);
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

                    if (data?.checkEmail.res) {
                      toast({
                        title: data.checkEmail.message,
                        duration: 3000,
                        status: 'error',
                        position: 'top',
                        variant: 'subtle',
                        isClosable: true
                      });
                      return;
                    }
                    setLoginEmail(email);
                    setLoginPassword(password);
                    onToggle();
                  }}>
                  <Form>
                    <Box pb="10px">
                      <FormControl>
                        <Text fontSize="xs">Email</Text>
                        <Input name="email" id="email" placeholder="email" />
                      </FormControl>
                    </Box>
                    <Box pb="10px">
                      <FormControl>
                        <Text fontSize="xs">Password</Text>
                        <Input
                          name="password"
                          w="250px"
                          id="password"
                          placeholder="password"
                          type="password"
                        />
                      </FormControl>
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

                    <Alert
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
                    </Alert>
                  </Form>
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
