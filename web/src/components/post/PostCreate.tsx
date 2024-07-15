import React, { useState } from 'react';
import {
  ModalContent,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Image,
  Box,
  VisuallyHidden,
  SlideFade,
  FormControl,
  Input,
  Center,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { PostDropzone } from './PostDropzone';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { DisplayButtons } from './DisplayButtons';
import { Formik, Form, Field } from 'formik';
import { useCreatePostMutation } from '../../generated/graphql';

interface PostCreateProps {
  isOpen: boolean;
  mobile: boolean;
  setIsOpen: any;
  profileId: any;
  admin: any;
}

export const PostCreate: React.FC<PostCreateProps> = ({
  isOpen,
  setIsOpen,
  admin,
  mobile,
  profileId
}) => {
  const [createPost] = useCreatePostMutation();
  const [image, setImage] = useState('');
  const [editImage, setEditImage] = useState(false);
  const [continued, setContinued] = useState(false);
  const [switched, setSwitched] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const close = () => {
    setIsOpen(false);
    setImage('');
    setContinued(false);
  };

  const onDelete = () => {
    setImage('');
  };
  const onEdit = () => {
    console.log('ON EDIT');
    setEditImage(true);
  };

  const onContinue = () => {
    setIsOpen(false);
    setContinued(true);
  };

  const onBack = () => {
    setContinued(false);
    setIsOpen(true);
  };

  const onSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSwitched(!switched);
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={close} size="xl" scrollBehavior={'inside'}>
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton
            _focus={{
              boxShadow: 'none'
            }}
          />
          <ModalBody>
            {image ? (
              <>
                <Box position="relative" w="100%" h="100%">
                  <DisplayButtons onDelete={onDelete} onEdit={onEdit} />
                  <Image src={image} w="100%" />
                </Box>
                <VisuallyHidden>
                  <PostDropzone
                    setEditImage={setEditImage}
                    editImage={editImage}
                    setImage={setImage}
                    mobile={mobile}
                  />
                </VisuallyHidden>
              </>
            ) : (
              <PostDropzone
                setEditImage={setEditImage}
                editImage={editImage}
                setImage={setImage}
                mobile={mobile}
              />
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!image}
              variant="outline"
              size="sm"
              colorScheme="pink"
              onClick={onContinue}
              rightIcon={<ArrowForwardIcon />}
              _focus={{
                boxShadow: 'none'
              }}>
              continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={continued} onClose={close} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>

          <ModalCloseButton
            _focus={{
              boxShadow: 'none'
            }}
          />

          <SlideFade in={continued}>
            <ModalBody>
              <Center mb="10px" backgroundColor="#F7FAFC">
                <Image src={image} h="200px" maxW="100%" />
              </Center>

              <Formik
                initialValues={{ artist: '', title: '', link: '' }}
                onSubmit={async ({ artist, title, link }) => {
                  setLoading(true);

                  let type: number = 0;
                  if (switched) {
                    type = 1;
                  }

                  const { data } = await createPost({
                    variables: {
                      media: image[0],
                      profileId,
                      artist,
                      title,
                      link,
                      type
                    },
                    update: async (store, { data }) => {
                      if (admin === 1) {
                        // const old = store.readQuery<GetTopPostsAdminQuery>({
                        //   query: GetTopPostsAdminDocument,
                        //   variables: { page: 1 }
                        // });
                        // store.writeQuery<GetTopPostsAdminQuery>({
                        //   query: GetTopPostsAdminDocument,
                        //   variables: { page: 1 },
                        //   data: {
                        //     __typename: 'Query',
                        //     getTopPostsAdmin: [
                        //       data.createPost.post,
                        //       ...old.getTopPostsAdmin
                        //     ]
                        //   }
                        // });
                      } else {
                        // const old = store.readQuery<GetTopPostsQuery>({
                        //   query: GetTopPostsDocument,
                        //   variables: { page: 1 }
                        // });
                        // store.writeQuery<GetTopPostsQuery>({
                        //   query: GetTopPostsDocument,
                        //   data: {
                        //     __typename: 'Query',
                        //     getTopPosts: [data.createPost.post, ...old.getTopPosts]
                        //   },
                        //   variables: { page: 1 }
                        // });
                      }
                    }
                  });

                  if (!data?.createPost.res) {
                    toast({
                      title: data?.createPost.message,
                      duration: 2000,
                      status: 'error',
                      position: 'top',
                      variant: 'subtle',
                      isClosable: true
                    });
                  } else {
                    toast({
                      title: `Your post is live 🚀 `,
                      status: 'success',
                      position: 'bottom',
                      variant: 'subtle',
                      isClosable: true
                    });
                    close();
                  }

                  setLoading(false);
                }}>
                {({ handleSubmit, handleChange }) => (
                  <Center>
                    <Form onSubmit={handleSubmit}>
                      <Box pb="10px">
                        <FormControl>
                          <Text fontSize="xs">Title</Text>
                          <Input
                            id="title"
                            onChange={handleChange}
                            name="title"
                            placeholder="title"
                            w="250px"
                          />
                        </FormControl>
                      </Box>
                      <Box pb="5px">
                        <FormControl>
                          <Text fontSize="xs">Artist</Text>
                          <Input
                            isDisabled={switched}
                            w="250px"
                            id="artist"
                            name="artist"
                            onChange={handleChange}
                            placeholder="artist"
                          />
                        </FormControl>
                      </Box>
                      {/* <Box pb="10px">
                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="original-work" mb="0" fontSize="xs">
                            Original work?
                          </FormLabel>
                          <Switch id="original-work" colorScheme="pink" onChange={onSwitch} />
                        </FormControl>
                      </Box> */}
                      <Box pb="10px">
                        <Text fontSize="xs">Artist Link</Text>
                        <Input
                          w="250px"
                          onChange={handleChange}
                          name="link"
                          id="link"
                          placeholder="link"
                        />
                      </Box>
                      <Box pb="10px" float="right">
                        <IconButton
                          aria-label="go back"
                          mr="3"
                          onClick={onBack}
                          variant="outline"
                          size="sm"
                          icon={<ArrowBackIcon />}
                          _focus={{
                            boxShadow: 'none'
                          }}
                        />
                        <Button
                          isLoading={loading}
                          type="submit"
                          colorScheme="pink"
                          variant="solid"
                          size="sm"
                          _focus={{
                            boxShadow: 'none'
                          }}>
                          Submit
                        </Button>
                      </Box>
                    </Form>
                  </Center>
                )}
              </Formik>
            </ModalBody>
          </SlideFade>
        </ModalContent>
      </Modal>
    </>
  );
};
