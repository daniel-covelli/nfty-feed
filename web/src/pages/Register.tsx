import React, { useState } from 'react';
import {
  useRegisterMutation,
  useLoginMutation,
  useMeQuery
} from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';
import { Link as ReactLink } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';

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

export const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { data } = useMeQuery();

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
                initialValues={{ username: '', first: '', last: '', bio: '' }}
                onSubmit={async (values) => {
                  const email = values.first;
                  const password = values.last;

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
                    <Field id='number' name='number'>
                      {({ field }) => (
                        <FormControl>
                          <Text fontSize='xs'>Number</Text>
                          <Input
                            {...field}
                            isRequired={true}
                            errorBorderColor='red.300'
                            id='number'
                            w='250px'
                            placeholder='number'
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
                      continue
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
                onSubmit={async (values) => {
                  const email = values.email;
                  const password = values.password;

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
                      type='submit'
                      colorScheme='pink'
                      variant='outline'
                      size='sm'>
                      register
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
