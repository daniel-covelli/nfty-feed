import React from 'react';
import { Text, Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { useGetUserQuery } from '../generated/graphql';
import { withRouter } from 'react-router-dom';

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = ({}) => {
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
    return <Text fontSize='2xl'>Nah 🥴</Text>;
  }
  return (
    <>
      <Text>Me?: {data.getUser.me ? 'True' : 'False'}</Text>
      <Text>Id: {data.getUser.user['id']}</Text>
      <Text>Email: {data.getUser.user['email']}</Text>
    </>
  );
};
