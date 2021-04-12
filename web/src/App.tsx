import React, { useState, useEffect } from 'react';
import Routes from './Routes';
import { setAccessToken } from './accessToken';
import { Text, Center } from '@chakra-ui/react';
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
          : `http://localhost:4000`
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
        <Text
          bgGradient='linear(to-l, #7928CA,#FF0080)'
          bgClip='text'
          fontSize='3xl'
          fontWeight='extrabold'>
          NftyFeed
        </Text>
        {showText ? (
          <>
            <br />
            <Text fontSize='xs'>
              Looks like the server is rebooting. This might take a minute or
              two 🥴
            </Text>
          </>
        ) : null}
      </Center>
    );
  }

  return <Routes />;
};
