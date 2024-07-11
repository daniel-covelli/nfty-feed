import React from 'react';
import { useLoginMutation, MeDocument, MeQuery, useMeQuery } from '../generated/graphql';
import { redirect, RouterProps, useParams } from 'react-router-dom';
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
  Link,
  SimpleGrid
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';

export const Login: React.FC = () => {
  const { data } = useMeQuery();
  const toast = useToast();
  const [login, { loading }] = useLoginMutation();

  if (data && data.me) {
    redirect('/');
  }

  return (
    <Center>
      <SimpleGrid columns={1} spacing="10px">
        <Box>
          <Text fontSize="lg">
            <b>Login</b>
          </Text>
        </Box>
        <Box>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={async ({ email, password }) => {
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
                  title: `Invalid credentials, please try again...`,
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
                  title: `Welcome back ${response?.data.login.user.profile?.first} 👋`,
                  description: `You're logged in!!`,
                  status: 'success',
                  position: 'bottom',
                  variant: 'subtle',
                  isClosable: true
                });
              }
            }}>
            {({ handleSubmit, handleChange }) => (
              <Form onSubmit={handleSubmit}>
                <Box pb="10px">
                  <FormControl>
                    <Input id="email" name="email" placeholder="email" onChange={handleChange} />
                  </FormControl>
                </Box>
                <Box pb="10px">
                  <FormControl>
                    <Input
                      w="250px"
                      id="password"
                      type="password"
                      placeholder="password"
                      name="password"
                      onChange={handleChange}
                    />
                  </FormControl>
                </Box>
                <Box pb="10px">
                  <Button
                    isLoading={loading}
                    type="submit"
                    colorScheme="pink"
                    variant="outline"
                    size="sm">
                    login
                  </Button>
                </Box>

                <Text fontSize="sm">
                  Don't have an account?{' '}
                  <Link
                    as={ReactLink}
                    to="/register"
                    color="teal.500"
                    _focus={{
                      boxShadow: 'none'
                    }}>
                    register
                  </Link>
                </Text>
              </Form>
            )}
          </Formik>
        </Box>
      </SimpleGrid>
    </Center>
  );
};
