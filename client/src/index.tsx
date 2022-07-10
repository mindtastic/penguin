import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { HashRouter } from 'react-router-dom';

import App from './App';
import theme from './theme';

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root'),
);
