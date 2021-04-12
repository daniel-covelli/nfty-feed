import React from 'react';
import {
  useRegisterMutation,
  useLoginMutation,
  MeQuery,
  MeDocument,
  useMeQuery
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
  Link
} from '@chakra-ui/react';

export const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const { data } = useMeQuery();

  if (data && data.me) {
    history.push('/');
  }

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const toast = useToast();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={async (values) => {
        const email = values.email;
        const password = values.password;

        const { data } = await register({
          variables: { email, password }
        });
        if (!data.register.res) {
          toast({
            title: data.register.message,
            status: 'error',
            position: 'top',
            variant: 'subtle',
            isClosable: true
          });
        } else {
          await login({
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
          history.push('/');
          toast({
            title: `Congradulations 🎉‏‏‎‏‏‎ ‎‏‏‎ ‎ ‎you are registered!!`,
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
      </Center>
    </Formik>
  );
};
