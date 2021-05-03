import React from 'react';
import { Box, VStack, Skeleton, SkeletonCircle } from '@chakra-ui/react';

interface LoadingPostProps {}

export const LoadingPost: React.FC<LoadingPostProps> = ({}) => {
  return (
    <Box pb='80px'>
      <Skeleton h='600px' mb='10px' />
      <SkeletonCircle size='8' pt='10px' />
    </Box>
  );
};
