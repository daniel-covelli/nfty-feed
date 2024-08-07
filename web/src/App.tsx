import React, { useState, useEffect } from 'react';
import { Text, Center, Grid, GridItem, Box } from '@chakra-ui/react';
import '@fontsource/didact-gothic';
import { useMeQuery } from './generated/graphql';
import { Home } from './pages/Home';
import Layout from './components/shared/Layout';

export const App: React.FC = () => {
  const [showText, setShowText] = useState(false);

  const { loading } = useMeQuery();

  useEffect(() => {
    setTimeout(() => {
      setShowText(true);
    }, 3000);
  }, []);

  if (loading) {
    return (
      <Center h="100vh">
        <Grid templateRows="repeat(2, 1fr)" gap={1}>
          <GridItem>
            <Center>
              <Text
                bgGradient="linear(to-l, #7928CA,#FF0080)"
                bgClip="text"
                fontSize="3xl"
                fontWeight="extrabold">
                NftyFeed
              </Text>
            </Center>
          </GridItem>
          <GridItem>
            <Center w="245px">
              {showText ? (
                <Box pl="10px">
                  <Text fontSize="sm">
                    Looks like the server is rebooting. This might take a minute or two...
                  </Text>
                </Box>
              ) : null}
            </Center>
          </GridItem>
        </Grid>
      </Center>
    );
  }

  return (
    <Layout>
      <Home />
    </Layout>
  );
};
