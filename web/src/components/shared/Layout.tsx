import { PropsWithChildren } from 'react';
import { NavBar } from '../navbar/NavBar';
import { Container } from '@chakra-ui/react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <NavBar />
      <Container maxW="container.lg" p="75px 20px 0 20px" h="0">
        {children}
      </Container>
    </div>
  );
};

export default Layout;
