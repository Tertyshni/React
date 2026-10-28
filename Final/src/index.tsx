import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app';
import { AppProviders, createQueryClient } from './setup';
import './style.css';

async function enableMocking() {
  const { worker } = await import('./mocks/worker');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

const queryClient = createQueryClient();

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <AppProviders client={queryClient}>
          <App />
        </AppProviders>
      </BrowserRouter>
    </StrictMode>,
  );
});
