import React, { useState } from 'react';
import {
  useRegisterMutation,
  useLoginMutation,
  useMeQuery,
  useRegisterProfileMutation
} from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';
import { Link as ReactLink } from 'react-router-dom';

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

export const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { data } = useMeQuery();
  const [loginData, setLoginData] = useState({});
  const [registerProfile] = useRegisterProfileMutation();

  if (data && data.me) {
    history.push('/');
  }

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const toast = useToast();

  return (
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
                  console.log('USERNAME', username);
                  console.log('LOGIN DATA', loginData);

                  const { data } = await registerProfile({
                    variables: { username, phone, first, last, bio }
                  });
                  // const { data } = await register({
                  //   variables: { email, password }
                  // });
                  // if (!data.register.res) {
                  //   toast({
                  //     title: data.register.message,
                  //     status: 'error',
                  //     position: 'top',
                  //     variant: 'subtle',
                  //     isClosable: true
                  //   });
                  // } else {
                  //   await login({
                  //     variables: { email, password },
                  //     update: (store, { data }) => {
                  //       if (!data) {
                  //         return null;
                  //       }
                  //       store.writeQuery<MeQuery>({
                  //         query: MeDocument,
                  //         data: {
                  //           __typename: 'Query',
                  //           me: data.login.user
                  //         }
                  //       });
                  //     }
                  //   });
                  // onToggle();
                  // toast({
                  //   title: `Congradulations 🎉‏‏‎‏‏‎ ‎‏‏‎ ‎ ‎you are registered!!`,
                  //   status: 'success',
                  //   position: 'bottom',
                  //   variant: 'subtle',
                  //   isClosable: true
                  // });
                }}>
                <Form>
                  {/* <Box pb='10px'>
                    <FormControl>
                      <Text fontSize='xs'>Image</Text>
                    </FormControl>
                  </Box> */}
                  <Box pb='10px'>
                    <Field id='username' name='username'>
                      {({ field }) => (
                        <FormControl>
                          <Text fontSize='xs'>Username</Text>
                          <Input
                            {...field}
                            isRequired={true}
                            errorBorderColor='red.300'
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
                            isRequired={true}
                            errorBorderColor='red.300'
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
                  // const { data } = await register({
                  //   variables: { email, password }
                  // });
                  // if (!data.register.res) {
                  //   toast({
                  //     title: data.register.message,
                  //     status: 'error',
                  //     position: 'top',
                  //     variant: 'subtle',
                  //     isClosable: true
                  //   });
                  // } else {
                  //   await login({
                  //     variables: { email, password },
                  //     update: (store, { data }) => {
                  //       if (!data) {
                  //         return null;
                  //       }
                  //       store.writeQuery<MeQuery>({
                  //         query: MeDocument,
                  //         data: {
                  //           __typename: 'Query',
                  //           me: data.login.user
                  //         }
                  //       });
                  //     }
                  //   });
                  setLoginData({ email, password });
                  onToggle();
                  toast({
                    title: `Congradulations 🎉‏‏‎‏‏‎ ‎‏‏‎ ‎ ‎you are registered!!`,
                    status: 'success',
                    position: 'bottom',
                    variant: 'subtle',
                    isClosable: true
                  });
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
  );
};
