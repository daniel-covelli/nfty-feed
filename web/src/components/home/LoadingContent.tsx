import React from 'react';
import { Box, Skeleton, VStack } from '@chakra-ui/react';
import { LoadingPost } from './LoadingPost';

interface LoadingContentProps {}

export const LoadingContent: React.FC<LoadingContentProps> = ({}) => {
  return (
    <Box maxW='600px' w='100%'>
      <LoadingPost />
      <LoadingPost />
      <LoadingPost />
      <LoadingPost />
    </Box>
  );
};
