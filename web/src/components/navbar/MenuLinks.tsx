import React, { useState } from 'react';
import {
  Stack,
  Box,
  Button,
  Text,
  Link,
  Spinner,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Popover,
  PopoverArrow,
  VStack,
  HStack,
  Icon,
  useMediaQuery,
  Avatar,
  IconButton,
  Tag
} from '@chakra-ui/react';
import { setAccessToken } from '../../accessToken';
import { Link as ReactLink } from 'react-router-dom';
import { useMeQuery, useLogoutMutation } from '../../generated/graphql';
import { Size } from '../shared/ClickableAvatar';
import { AtSignIcon } from '@chakra-ui/icons';
import { IoIosHome } from 'react-icons/io';
import { IoAdd, IoNotifications } from 'react-icons/io5';
import { PostCreate } from '../post/PostCreate';
import { SendInvitationLink } from './SendInvitationLink';
import { InvitationModal } from '../invitation/InvitationModal';
import { AdminInvitationModal } from '../invitation/AdminInvitationModal';

interface MenuLinksProps {
  isOpen: boolean;
  paddingRight: string;
  toggle: any;
  setIsOpen: any;
}

export const MenuLinks: React.FC<MenuLinksProps> = ({
  isOpen,
  toggle,
  paddingRight,
  setIsOpen
}) => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [invitationOpen, setInvitationOpen] = useState(false);
  const [adminInvitationOpen, setAdminInvitaitonOpen] = useState(false);
  const [isTabletOrMobile] = useMediaQuery('(max-width: 767px)');

  let body: any = null;

  if (data && data.me) {
    body = `${data.me.profile?.username}`;
  }

  const avatarClick = () => {
    setPopoverOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setPopoverOpen(false);
  };

  const onLogout = async () => {
    await logout();
    setAccessToken('');
    await client!.resetStore();
    setIsOpen(false);
    setPopoverOpen(false);
  };

  const onCreate = () => {
    setPostOpen(true);
  };

  const onInvitationClick = () => {
    setInvitationOpen(true);
    console.log('INVITATION MODAL');
  };

  const adminOpenInvitation = () => {
    setAdminInvitaitonOpen(true);
  };

  return (
    <Box
      paddingRight={paddingRight}
      zIndex={1000}
      display={{ base: isOpen ? 'block' : 'none', md: 'block' }}
      flexBasis={{ base: '100%', md: 'auto' }}>
      <Stack
        spacing={4}
        align="center"
        justify={['center', 'space-between', 'flex-end', 'flex-end']}
        direction={['column', 'row', 'row', 'row']}
        pt={[4, 4, 0, 0]}>
        {!loading && data && data.me ? (
          isTabletOrMobile ? (
            <>
              <Link
                as={ReactLink}
                to={`/`}
                w="100%"
                onClick={onCreate}
                _focus={{
                  boxShadow: 'none'
                }}
                _hover={{ textDecoration: 'none' }}>
                <Button variant="outline" w="100%" colorScheme="pink" size="md">
                  <Text display="block">Create post</Text>
                </Button>
              </Link>
              <Link
                as={ReactLink}
                to={`/at/${data.me.profile?.username ?? ''}`}
                onClick={toggle}
                w="100%"
                _focus={{
                  boxShadow: 'none'
                }}
                _hover={{ textDecoration: 'none' }}>
                <Button variant="outline" w="100%" size="md">
                  <HStack>
                    <Avatar
                      size="xs"
                      name={`${data.me.profile?.first} ${data.me.profile?.last}`}
                      src={data.me.profile?.profileImageId ?? ''}
                    />

                    <Text display="block">Profile</Text>
                  </HStack>
                </Button>
              </Link>
              <Link
                as={ReactLink}
                to={`/`}
                w="100%"
                onClick={toggle}
                _focus={{
                  boxShadow: 'none'
                }}
                _hover={{ textDecoration: 'none' }}>
                <Button variant="outline" w="100%" size="md">
                  <Text display="block">Home</Text>
                </Button>
              </Link>

              <Button
                w="100%"
                colorScheme="red"
                size="md"
                variant="outline"
                _focus={{
                  boxShadow: 'none'
                }}
                onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              {data.me.admin ? (
                <>
                  <Tag size="lg" variant="outline" colorScheme="red">
                    Admin
                  </Tag>
                  <Button
                    size="sm"
                    onClick={adminOpenInvitation}
                    _focus={{
                      boxShadow: 'none'
                    }}>
                    Add invitation
                  </Button>
                </>
              ) : null}
              <IconButton
                borderRadius="20px"
                aria-label="notifications"
                icon={<Icon as={IoNotifications} fontSize="20px" />}
                colorScheme="pink"
                variant="ghost"
                size="sm"
                _focus={{
                  boxShadow: 'none'
                }}
                isDisabled
              />
              <SendInvitationLink invitations={data.me.invitations} onClick={onInvitationClick} />
              <IconButton
                borderRadius="20px"
                aria-label="create a post"
                icon={<Icon as={IoAdd} fontSize="20px" />}
                colorScheme="pink"
                variant="outline"
                size="sm"
                onClick={onCreate}
                _focus={{
                  boxShadow: 'none'
                }}
              />
              <Popover onClose={onClose} isOpen={popoverOpen} placement="bottom-end">
                <PopoverTrigger>
                  <Button
                    onClick={avatarClick}
                    variant="link"
                    _focus={{
                      boxShadow: 'none'
                    }}
                    _hover={{ textDecoration: 'none' }}>
                    <Box
                      borderColor={`${popoverOpen ? '#7928CA' : 'transparent'}`}
                      boxSizing="border-box"
                      borderWidth="2px"
                      padding="2px"
                      borderRadius="50px">
                      <Avatar
                        src={data.me.profile?.profileImageId ?? ''}
                        name={`${data.me.profile?.first} ${data.me.profile?.last}`}
                        size={Size.SM}
                      />
                    </Box>
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  width="175px"
                  top="-2px"
                  boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;"
                  _focus={{
                    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;'
                  }}>
                  <PopoverArrow />
                  <PopoverHeader>
                    <Text fontSize="14px">{body}</Text>
                  </PopoverHeader>

                  <PopoverBody p={0}>
                    <VStack align="stretch" spacing={0}>
                      <Link
                        as={ReactLink}
                        onClick={onClose}
                        to={`/at/${data.me.profile?.username}`}
                        colorScheme="pink"
                        border="none"
                        _focus={{
                          boxShadow: 'none'
                        }}
                        _hover={{ textDecoration: 'none' }}>
                        <Box
                          py={2}
                          transition="0.2s"
                          borderRadius="4px"
                          pl={4}
                          _hover={{ backgroundColor: 'gray.100' }}>
                          <HStack>
                            <Icon fontSize="14px" as={AtSignIcon} />
                            <Text fontSize="14px">
                              <b>Profile</b>
                            </Text>
                          </HStack>
                        </Box>
                      </Link>
                      <Link
                        as={ReactLink}
                        onClick={onClose}
                        to={`/`}
                        colorScheme="pink"
                        border="none"
                        _focus={{
                          boxShadow: 'none'
                        }}
                        _hover={{ textDecoration: 'none' }}>
                        <Box
                          py={2}
                          transition="0.2s"
                          borderRadius="4px"
                          pl={4}
                          _hover={{ backgroundColor: 'gray.100' }}>
                          <HStack>
                            <Icon fontSize="14px" as={IoIosHome} />
                            <Text fontSize="14px">
                              <b>Home</b>
                            </Text>
                          </HStack>
                        </Box>
                      </Link>
                      <Link
                        as={ReactLink}
                        to={'/'}
                        colorScheme="pink"
                        border="none"
                        _focus={{
                          boxShadow: 'none'
                        }}
                        _hover={{ textDecoration: 'none' }}
                        onClick={onLogout}>
                        <Box
                          py={2}
                          transition="0.1s"
                          borderRadius="3px"
                          pl={4}
                          color="red.600"
                          _hover={{ backgroundColor: 'red.50' }}>
                          <Text fontSize="14px">
                            <b>Logout</b>
                          </Text>
                        </Box>
                      </Link>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </>
          )
        ) : loading ? (
          <Spinner size="sm" />
        ) : (
          <>
            <Link
              as={ReactLink}
              to="/register"
              onClick={toggle}
              w="100%"
              py={`${isTabletOrMobile ? '0' : '4px'}`}
              _focus={{
                boxShadow: 'none'
              }}>
              <Button
                w="100%"
                display="block"
                size={isTabletOrMobile ? 'md' : 'sm'}
                colorScheme="pink"
                variant="ghost"
                _focus={{
                  boxShadow: 'none'
                }}>
                Register
              </Button>
            </Link>
            <Link
              as={ReactLink}
              to="/login"
              py={`${isTabletOrMobile ? '0' : '4px'}`}
              onClick={toggle}
              w="100%"
              _focus={{
                boxShadow: 'none'
              }}>
              <Button
                w="100%"
                size={isTabletOrMobile ? 'md' : 'sm'}
                colorScheme="pink"
                display="block"
                variant="solid"
                _focus={{
                  boxShadow: 'none'
                }}>
                Login
              </Button>
            </Link>
          </>
        )}
      </Stack>
      <PostCreate
        profileId={data && data.me ? data.me.profile?.id : null}
        admin={data && data.me ? data.me.admin : null}
        isOpen={postOpen}
        mobile={isTabletOrMobile}
        setIsOpen={setPostOpen}
      />
      <InvitationModal
        isOpen={invitationOpen}
        setOpen={setInvitationOpen}
        invitations={data && data.me ? data.me.invitations : 0}
      />
      {data && data.me && data.me.admin ? (
        <AdminInvitationModal isOpen={adminInvitationOpen} setOpen={setAdminInvitaitonOpen} />
      ) : null}
    </Box>
  );
};
