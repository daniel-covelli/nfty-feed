import React from 'react';
import { useLoginMutation, MeDocument, MeQuery, useMeQuery } from '../generated/graphql';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  if (data && data.me) {
    navigate('/home');
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
              await login({
                variables: { email, password },
                awaitRefetchQueries: true,
                refetchQueries: [{ query: MeDocument }],
                onError: (err) => {
                  toast({
                    title: err.message,
                    status: 'error',
                    position: 'top',
                    variant: 'subtle',
                    isClosable: true
                  });
                },
                onCompleted: (data) => {
                  navigate('/home');
                  toast({
                    title: `Welcome back ${data.login.profile?.first} 👋`,
                    description: `You're logged in!!`,
                    status: 'success',
                    position: 'bottom',
                    variant: 'subtle',
                    isClosable: true
                  });
                }
              });
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
