import React, { useState } from 'react';
import { useLoginMutation, MeDocument, MeQuery } from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import {
  Input,
  Button,
  FormControl,
  useToast,
  Center,
  Box
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const toast = useToast();
  const [login] = useLoginMutation();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={async (values) => {
        const email = values.email;
        const password = values.password;
        const response = await login({
          variables: { email, password },
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
            title: `Invalid Password! Please try again...`,
            status: 'error',
            position: 'top',
            variant: 'subtle',
            isClosable: true
          });
        }
        console.log('RESPONSE', response);
        if (response && response.data) {
          setAccessToken(response.data.login.accessToken);
          history.push('/');
          toast({
            title: `Welcome 👋‏‏‎‎‏‏‎‎‎‎‏‏‎ ‎ your logged in!!`,
            status: 'success',
            position: 'top',
            variant: 'subtle',
            isClosable: true
          });
        }
      }}>
      <Center>
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
                    {...field}
                    id='password'
                    type='password'
                    placeholder='password'
                  />
                </FormControl>
              )}
            </Field>
          </Box>

          <Button type='submit' colorScheme='teal' variant='solid' size='sm'>
            login
          </Button>
        </Form>
      </Center>
    </Formik>
  );
};
