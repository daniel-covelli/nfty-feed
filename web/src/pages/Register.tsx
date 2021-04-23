import React, { useState, useRef, useEffect } from 'react';
import {
  useRegisterMutation,
  useLoginMutation,
  useMeQuery,
  MeQuery,
  MeDocument,
  useCheckEmailMutation,
  UsersQuery,
  UsersDocument
} from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';
import { Link as ReactLink } from 'react-router-dom';
import Dropzone, { useDropzone } from 'react-dropzone';
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
  Spinner,
  IconButton
} from '@chakra-ui/react';
import { ArrowForwardIcon, DeleteIcon, SettingsIcon } from '@chakra-ui/icons';
import { setAccessToken } from '../accessToken';
import { CropperModal } from '../componenets/register/CropperModal';

export const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { data: me } = useMeQuery();
  const [cropData, setCropData] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [image, setImage] = useState([]);
  const [open, setOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [checkEmail] = useCheckEmailMutation();

  if (me && me.me) {
    history.push('/');
  }

  const [register, { loading: registerLoading }] = useRegisterMutation();
  const [login, { loading: loginLoading }] = useLoginMutation();
  const toast = useToast();

  useEffect(() => {
    console.log('CROPDATA', cropData);
  }, [cropData]);

  return (
    <>
      <Center>
        <SimpleGrid columns={1} spacing='10px'>
          {isOpen ? (
            <SlideFade in={isOpen}>
              <Box mb='10px'>
                <Text fontSize='lg'>
                  <b>Profile</b>
                </Text>
              </Box>
              <Box>
                <Formik
                  initialValues={{
                    username: '',
                    phone: '',
                    first: '',
                    last: '',
                    bio: ''
                  }}
                  onSubmit={async ({ username, phone, first, last, bio }) => {
                    const { data } = await register({
                      variables: {
                        email: loginEmail,
                        password: loginPassword,
                        username,
                        phone,
                        first,
                        last,
                        bio
                      },
                      update: (store, { data }) => {
                        const old = store.readQuery<UsersQuery>({
                          query: UsersDocument
                        });
                        if (!data || !old) {
                          return null;
                        }
                        store.writeQuery<UsersQuery>({
                          query: UsersDocument,
                          data: {
                            __typename: 'Query',
                            users: [...old.users, data.register.user]
                          }
                        });
                      }
                    });

                    if (!data.register.res) {
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
                        history.push('/');
                        toast({
                          title: `Congradulations ${response.data.login.user.profile.first} 🎉 `,
                          description: `‎You're account ${response.data.login.user.profile.username} is registered.`,
                          status: 'success',
                          position: 'bottom',
                          variant: 'subtle',
                          isClosable: true
                        });
                      }
                    }
                  }}>
                  <Form>
                    <Center pb='10px'>
                      <Box position='relative'>
                        {cropData ? (
                          <>
                            <IconButton
                              position='absolute'
                              right='1'
                              bottom='1'
                              aria-label='Edit Photo'
                              icon={<SettingsIcon />}
                              size='xs'
                              onClick={() => setOpen(true)}
                              _focus={{
                                boxShadow: 'none'
                              }}
                            />
                            <IconButton
                              position='absolute'
                              right='1'
                              top='1'
                              colorScheme='red'
                              aria-label='Delete Photo'
                              icon={<DeleteIcon />}
                              size='xs'
                              onClick={() => setCropData('')}
                              _focus={{
                                boxShadow: 'none'
                              }}
                            />
                          </>
                        ) : null}
                        <Dropzone
                          noClick={cropData ? true : false}
                          noDrag={cropData ? true : false}
                          onDrop={(files) => {
                            setImageLoading(true);
                            const file = files[0];
                            const reader = new FileReader();
                            const url = reader.readAsDataURL(file);
                            console.log('BER', image);
                            reader.onloadend = () => {
                              setImage([reader.result]);
                            };
                            setImageLoading(false);

                            console.log('BEFORE SET OPEN');
                            setOpen(true);
                            console.log('AFTER SET OPEN');

                            console.log('IS OPEN', open);

                            console.log('AFTER', image);
                          }}>
                          {({ getRootProps, getInputProps }) => (
                            <Box
                              style={{
                                borderWidth: '2px',
                                borderColor: `${
                                  cropData ? 'lightGrey' : 'grey'
                                }`,
                                borderStyle: `${cropData ? 'solid' : 'dashed'}`,
                                borderRadius: '100px',
                                outlineColor: 'transparent'
                              }}
                              {...getRootProps()}
                              __hover={{ boxShadow: 'grey' }}>
                              <input {...getInputProps()} />
                              <Box
                                style={{
                                  backgroundImage: `url(${
                                    cropData ? cropData : null
                                  })`,
                                  backgroundPosition: 'center',
                                  backgroundSize: 'cover',
                                  backgroundColor: 'lightgrey',
                                  height: '120px',
                                  width: '120px',
                                  borderRadius: '100px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  color: 'white',
                                  cursor: `${cropData ? 'auto' : 'pointer'}`,
                                  borderStyle: 'dotted'
                                }}
                                __hover={{ boxShadow: 'grey' }}>
                                {!cropData ? (
                                  imageLoading ? (
                                    <Spinner size='sm' />
                                  ) : (
                                    <b>add image</b>
                                  )
                                ) : null}
                              </Box>
                            </Box>
                          )}
                        </Dropzone>
                      </Box>
                    </Center>
                    <Box pb='10px'>
                      <Field id='username' name='username'>
                        {({ field }) => (
                          <FormControl>
                            <Text fontSize='xs'>Username</Text>
                            <Input
                              {...field}
                              id='username'
                              w='250px'
                              placeholder='username'
                            />
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box pb='10px'>
                      <Field id='phone' name='phone'>
                        {({ field }) => (
                          <FormControl>
                            <Text fontSize='xs'>Number</Text>
                            <Input
                              {...field}
                              id='phone'
                              w='250px'
                              placeholder='phone'
                              type='phone'
                            />
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box pb='10px'>
                      <Field id='first' name='first'>
                        {({ field }) => (
                          <FormControl>
                            <Text fontSize='xs'>First</Text>
                            <Input {...field} id='first' placeholder='first' />
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box pb='10px'>
                      <Field id='last' name='last'>
                        {({ field }) => (
                          <FormControl>
                            <Text fontSize='xs'>Last</Text>
                            <Input {...field} id='last' placeholder='last' />
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box pb='10px'>
                      <Field id='bio' name='bio'>
                        {({ field }) => (
                          <FormControl>
                            <Text fontSize='xs'>Bio</Text>
                            <Textarea {...field} id='bio' placeholder='bio' />
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box pb='10px'>
                      <Button
                        isLoading={registerLoading || loginLoading}
                        type='submit'
                        colorScheme='pink'
                        variant='outline'
                        size='sm'>
                        register
                      </Button>
                    </Box>
                  </Form>
                </Formik>
              </Box>
            </SlideFade>
          ) : (
            <>
              <Box>
                <Text fontSize='lg'>
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

                    if (!data.checkEmail.res) {
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
                    <Box pb='10px'>
                      <Field id='email' name='email'>
                        {({ field }) => (
                          <FormControl>
                            <Input {...field} id='email' placeholder='email' />
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box pb='10px'>
                      <Field id='password' name='password'>
                        {({ field }) => (
                          <FormControl>
                            <Input
                              w='250px'
                              {...field}
                              id='password'
                              placeholder='password'
                              type='password'
                            />
                          </FormControl>
                        )}
                      </Field>
                    </Box>
                    <Box pb='10px'>
                      <Button
                        rightIcon={<ArrowForwardIcon />}
                        type='submit'
                        colorScheme='pink'
                        variant='outline'
                        size='sm'>
                        continue
                      </Button>
                    </Box>
                    <Text fontSize='sm'>
                      Already have an account?{' '}
                      <Link
                        as={ReactLink}
                        to='/login'
                        color='teal.500'
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
        image={image[0]}
        open={open}
        setOpen={setOpen}
        cropData={cropData}
        setCropData={setCropData}
      />
    </>
  );
};
