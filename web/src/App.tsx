import React, { useState, useEffect } from 'react';
import Routes from './Routes';
import { setAccessToken } from './accessToken';
import { Text, Center, Grid, GridItem, Box } from '@chakra-ui/react';
import '@fontsource/didact-gothic';

interface AppProps {}

export const App: React.FC<AppProps> = () => {
  const [loading, setLoading] = useState(true);
  const [showText, setShowtext] = useState(false);

  useEffect(() => {
    fetch(
      `${
        process.env.NODE_ENV === 'production'
          ? `https://blooming-scrubland-30700.herokuapp.com`
          : `${process.env.REACT_APP_PHONE_SERVER_URL}`
      }/refresh_token`,
      {
        method: 'POST',
        credentials: 'include'
      }
    ).then(async (x) => {
      const { accessToken } = await x.json();
      setAccessToken(accessToken);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowtext(true);
    }, 3000);
  }, []);

  if (loading) {
    return (
      <Center h='100vh'>
        <Grid templateRows='repeat(2, 1fr)' gap={1}>
          <GridItem>
            <Center>
              <Text
                bgGradient='linear(to-l, #7928CA,#FF0080)'
                bgClip='text'
                fontSize='3xl'
                fontWeight='extrabold'>
                NftyFeed
              </Text>
            </Center>
          </GridItem>
          <GridItem>
            <Center w='245px'>
              {showText ? (
                <Box pl='10px'>
                  <Text fontSize='sm'>
                    Looks like the server is rebooting. This might take a minute
                    or two...
                  </Text>
                </Box>
              ) : null}
            </Center>
          </GridItem>
        </Grid>
      </Center>
    );
  }

  return <Routes />;
};
