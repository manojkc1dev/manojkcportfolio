import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { CMSProvider } from './context/CMSContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CMSProvider>
      <App />
    </CMSProvider>
  </StrictMode>,
);

