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

  console.log('USER', data.getUser);
  return (
    <>
      <Text>Me?: {data.getUser.me ? 'True' : 'False'}</Text>
      <Text>Id: {data.getUser.user['id']}</Text>
      <Text>Email: {data.getUser.user['email']}</Text>
      {data.getUser.user.profile ? (
        <>
          <Text>
            Username:
            {data.getUser.user.profile.username}
          </Text>
          <Text>Number: {data.getUser.user.profile.phone}</Text>
          <Text>First: {data.getUser.user.profile.first}</Text>
          <Text>Last: {data.getUser.user.profile.last}</Text>
          <Text>Bio: {data.getUser.user.profile.bio}</Text>
        </>
      ) : (
        <Text>Profile: no profile</Text>
      )}
    </>
  );
};
