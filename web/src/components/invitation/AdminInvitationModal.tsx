import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Center,
  VStack,
  Box,
  FormControl,
  Input,
  Button,
  useToast
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import { useSendAdminInvitationMutation } from '../../generated/graphql';

interface AdminInvitationModalProps {
  isOpen: boolean;
  setOpen: any;
}

export const AdminInvitationModal: React.FC<AdminInvitationModalProps> = ({
  isOpen,
  setOpen
}) => {
  const [sendAdminInvitation] = useSendAdminInvitationMutation();
  const onClose = () => {
    setOpen(false);
  };
  const toast = useToast();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='sm'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Admin invitation</ModalHeader>
        <ModalCloseButton
          _focus={{
            boxShadow: 'none'
          }}
        />
        <ModalBody>
          <Center>
            <VStack>
              <Text pb='20px'>
                Manually add someone to the invitations table
              </Text>
              <Formik
                initialValues={{ number: '', code: '' }}
                onSubmit={async ({ number, code }) => {
                  const { data } = await sendAdminInvitation({
                    variables: { number, code }
                  });

                  if (!data.sendAdminInvitation.res) {
                    toast({
                      title: data.sendAdminInvitation.message,
                      duration: 2000,
                      status: 'error',
                      position: 'top',
                      variant: 'subtle',
                      isClosable: true
                    });
                  } else {
                    toast({
                      title: `Invitation added for number - ${data.sendAdminInvitation.invitation.number}`,
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
                    <Box pb='10px'>
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
                    <Box pb='50px'>
                      <Field id='code' name='code'>
                        {({ field }) => (
                          <FormControl>
                            <Text fontSize='xs'>Invitation Code</Text>
                            <Input
                              {...field}
                              id='code'
                              placeholder='code'
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
                        // isLoading={loading}
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
            </VStack>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
