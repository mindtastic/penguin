import { Box } from '@chakra-ui/react';
import React, { createContext, useMemo, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import routes, { PenguinRoute } from './routes';

export default function App() {
  const SidebarContext = createContext({});
  const [toggleSidebar, setSidebarState] = useState(false);
  const providerValue = useMemo(() => ({
    toggleSidebar, setSidebarState,
  }), [false]);

  const width = { base: '100%', xl: 'calc(100% - 290px)' };

  const getRoutes = (r: Array<PenguinRoute>) => (
    r.map((prop) => <Route path={prop.path} component={prop.component} key={prop.path} />)
  );

  return (
    <Box>
      <SidebarContext.Provider value={providerValue}>
        <Sidebar routes={routes} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={width}
          maxWidth={width}
          transition="all 0.33s cubix-bezier(0.685, 0.5, 0.35, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Box
            mx="auto"
            p={{ base: '20px', md: '30px' }}
            pe="20px"
            minH="100vh"
            pt="50px"
          >
            <Switch>
              {getRoutes(routes)}
              <Redirect from="/" to="/annotations" />
            </Switch>
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
