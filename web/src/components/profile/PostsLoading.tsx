import React from 'react';
import { Wrap, WrapItem, Skeleton, Center } from '@chakra-ui/react';

interface PostsLoadingProps {}

export const PostsLoading: React.FC<PostsLoadingProps> = ({}) => {
  const posts = [];
  for (var i = 0; i < 15; i++) {
    posts.push(
      <WrapItem maxW='47.5%' key={i}>
        <Skeleton paddingTop='100%' w='190px' />
      </WrapItem>
    );
  }
  return (
    <Wrap pt='10px' pl='1px'>
      {posts}
    </Wrap>
  );
};
