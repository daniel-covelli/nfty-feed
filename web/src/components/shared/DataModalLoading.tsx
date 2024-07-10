import React from 'react';
import { Box, SkeletonCircle, HStack, Skeleton, VStack } from '@chakra-ui/react';

interface DataModalLoadingProps {}

export const DataModalLoading: React.FC<DataModalLoadingProps> = ({}) => {
  const fields: JSX.Element[] = [];
  for (let i = 1; i <= 7; i++) {
    fields.push(
      <HStack pb="20px">
        <Box>
          <SkeletonCircle size="8" />
        </Box>
        <VStack align="left">
          <Box w="120px">
            <Skeleton height="12px" />
          </Box>
          <Box w="75px">
            <Skeleton height="10px" />
          </Box>
        </VStack>
        <Box alignContent="right" w="100%">
          <Box w="70px">
            <Skeleton height="10px" />
          </Box>
        </Box>
      </HStack>
    );
  }

  return (
    <Box height="400px" maxH="90vh" p="10px">
      {fields}
    </Box>
  );
};
