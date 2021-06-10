import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Divider,
  Box,
  Center,
  Spinner,
  VStack,
  Text,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText
} from '@chakra-ui/react';
import { LinkableAvatar } from '../shared/LinkableAvatar';
import { Size } from '../shared/ClickableAvatar';
import { LinkableText } from '../shared/LinkableText';
import { useGetFollowersDataLazyQuery } from '../../generated/graphql';
import { DataModalLoading } from '../shared/DataModalLoading';

interface SubscriptionModalProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userId: number;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  setOpen,
  userId
}) => {
  const [getData, { data, loading }] = useGetFollowersDataLazyQuery({
    variables: { userId },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (isOpen) getData();
  }, [isOpen]);

  const onClose = () => {
    setOpen(false);
  };

  //   console.log('LENGTH', data ? data.getFollowersData : 'null');
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='sm'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize='md'>Followers</ModalHeader>
        <ModalCloseButton
          _focus={{
            boxShadow: 'none'
          }}
        />
        <Divider />
        {loading ? (
          <DataModalLoading />
        ) : (
          <Box
            px='10px'
            pt='5px'
            pb='5px'
            height='400px'
            maxH='90vh'
            overflow='scroll'>
            {data ? (
              data.getFollowersData.length === 0 ? (
                <Center>
                  <VStack pt='30px'>
                    <Text color='gray.500' fontSize='sm'>
                      No likes on this post yet
                    </Text>
                    <Text color='gray.500' fontSize='sm'>
                      ¯\_₍⸍⸌̣ʷ̣̫⸍̣⸌₎_/¯
                    </Text>
                  </VStack>
                </Center>
              ) : (
                data.getFollowersData.map((follower) => (
                  <HStack spacing={3} pb='5px' key={follower.profile.id}>
                    <LinkableAvatar
                      onClick={onClose}
                      profilePhoto={follower.profile.profileImageId}
                      first={follower.profile.first}
                      last={follower.profile.last}
                      size={Size.SM}
                      route={`/at/${follower.profile.username}`}
                    />
                    <VStack spacing={0}>
                      <Box w='175px' float='left'>
                        <LinkableText
                          onClick={onClose}
                          route={`/at/${follower.profile.username}`}
                          size={Size.SM}
                          bold={true}
                          text={follower.profile.username}
                          color='black'
                        />
                      </Box>

                      <Box w='175px' float='left'>
                        <Text fontSize='xs' isTruncated>
                          {follower.profile.first} {follower.profile.last}
                        </Text>
                      </Box>
                    </VStack>

                    <Box w='100%' float={'right'}>
                      <Text
                        float={'right'}
                        pt='4px'
                        fontSize='10px'
                        color='gray.500'
                        textTransform='uppercase'>
                        <b>
                          {follower.me
                            ? 'You'
                            : follower.following
                            ? 'following'
                            : ''}
                        </b>
                      </Text>
                    </Box>
                  </HStack>
                ))
              )
            ) : null}
          </Box>
        )}
      </ModalContent>
    </Modal>
  );
};
