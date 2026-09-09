import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/tokens.css';
import './styles/base.css';
import './styles/componenten.css';

import App from './App.jsx';
import { ProjectProvider } from './store/ProjectContext.jsx';
import { ToastProvider } from './store/ToastContext.jsx';
import { Foutgrens } from './components/ui/Foutgrens.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Foutgrens>
      <ProjectProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ProjectProvider>
    </Foutgrens>
  </StrictMode>,
);
