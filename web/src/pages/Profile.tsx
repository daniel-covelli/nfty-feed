import React from 'react';
import {
  Text,
  Box,
  SkeletonCircle,
  SkeletonText,
  Link
} from '@chakra-ui/react';
import { useGetUserQuery } from '../generated/graphql';
import { Link as ReactLink } from 'react-router-dom';

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = () => {
  console.log('PATHNAME', window.location.href);
  const { data, loading, error } = useGetUserQuery({
    variables: { path: window.location.href }
  });
  if (loading) {
    return (
      <Box padding='6'>
        <SkeletonCircle size='10' />
        <SkeletonText mt='4' noOfLines={4} spacing='4' />
      </Box>
    );
  }

  if (error) {
    return (
      <Text>
        To access this page please{' '}
        <Link as={ReactLink} to={`/register`} color='teal.500'>
          register
        </Link>{' '}
        or{' '}
        <Link as={ReactLink} to={`/login`} color='teal.500'>
          login
        </Link>
        .
      </Text>
    );
  }
  return (
    <>
      <Text>Me?: {data.getUser.me ? 'True' : 'False'}</Text>
      <Text>Id: {data.getUser.user['id']}</Text>
      <Text>Email: {data.getUser.user['email']}</Text>
    </>
  );
};
