import React from 'react';
import { useLoginMutation, MeDocument, MeQuery } from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import { Link as ReactLink } from 'react-router-dom';
import {
  Input,
  Button,
  FormControl,
  useToast,
  Center,
  Box,
  Text,
  Link
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
            title: `Invalid credentials! Please try again...`,
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
            title: `Welcome back, ‎you're logged in!!`,
            status: 'success',
            position: 'bottom',
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
                    w='250px'
                    {...field}
                    id='password'
                    type='password'
                    placeholder='password'
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
              login
            </Button>
          </Box>

          <Text fontSize='sm'>
            Don't have an account?{' '}
            <Link
              as={ReactLink}
              to='/register'
              color='teal.500'
              _focus={{
                boxShadow: 'none'
              }}>
              register
            </Link>
          </Text>
        </Form>
      </Center>
    </Formik>
  );
};
