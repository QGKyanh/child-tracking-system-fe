import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import store from '@/configs/store.js';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  </StrictMode>
);
