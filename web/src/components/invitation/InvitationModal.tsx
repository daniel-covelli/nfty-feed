import React from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  ModalFooter,
  Button,
  Center,
  VStack,
  Box,
  FormControl,
  Input,
  ModalCloseButton,
  useToast
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import {
  useSendInvitationMutation,
  MeQuery,
  MeDocument
} from '../../generated/graphql';

interface InvitationModalProps {
  isOpen: boolean;
  setOpen: any;
  invitations: number;
}

export const InvitationModal: React.FC<InvitationModalProps> = ({
  isOpen,
  setOpen,
  invitations
}) => {
  const [sendInvitation, { loading }] = useSendInvitationMutation();
  const onClose = () => {
    setOpen(false);
  };
  const toast = useToast();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='sm'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Invite a friend</ModalHeader>
        <ModalCloseButton
          _focus={{
            boxShadow: 'none'
          }}
        />
        <ModalBody>
          <Center>
            <VStack>
              {invitations > 0 ? (
                <>
                  <Text>
                    <b>
                      {`You have ${invitations} invitaion${
                        invitations === 1 ? '' : 's'
                      } left `}
                    </b>{' '}
                    ✨
                  </Text>
                  <Text pb='20px' fontSize='xs'>
                    Invite a friend using their number
                  </Text>
                  <Formik
                    initialValues={{ number: '' }}
                    onSubmit={async ({ number }) => {
                      const { data } = await sendInvitation({
                        variables: { number }
                      });

                      if (!data.sendInvitation.res) {
                        toast({
                          title: data.sendInvitation.message,
                          duration: 2000,
                          status: 'error',
                          position: 'top',
                          variant: 'subtle',
                          isClosable: true
                        });
                      } else {
                        toast({
                          title: data.sendInvitation.message,
                          status: 'success',
                          position: 'bottom',
                          variant: 'subtle',
                          isClosable: true
                        });
                        onClose();
                      }
                    }}>
                    <Center>
                      <Form>
                        <Box pb='50px'>
                          <Field id='number' name='number'>
                            {({ field }) => (
                              <FormControl>
                                <Text fontSize='xs'>Phone number</Text>
                                <Input
                                  {...field}
                                  id='number'
                                  placeholder='number'
                                  w='250px'
                                />
                              </FormControl>
                            )}
                          </Field>
                        </Box>
                        <Box pb='10px' float='right'>
                          <Button
                            mr='3'
                            onClick={onClose}
                            variant='outline'
                            size='sm'
                            _focus={{
                              boxShadow: 'none'
                            }}>
                            close
                          </Button>
                          <Button
                            isLoading={loading}
                            type='submit'
                            colorScheme='pink'
                            variant='solid'
                            size='sm'
                            _focus={{
                              boxShadow: 'none'
                            }}>
                            Submit
                          </Button>
                        </Box>
                      </Form>
                    </Center>
                  </Formik>
                </>
              ) : (
                <>
                  <Text>
                    <b>Looks like you have 0 invitations left</b> 🥺
                  </Text>
                  <Text fontSize='xs' pb='30px'>
                    Try reaching out if you want more invites
                  </Text>
                  <Box pb='10px' w='100%'>
                    <Button
                      float='right'
                      onClick={onClose}
                      colorScheme='pink'
                      variant='outline'
                      size='sm'
                      _focus={{
                        boxShadow: 'none'
                      }}>
                      close
                    </Button>
                  </Box>
                </>
              )}
            </VStack>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
