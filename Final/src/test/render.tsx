import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../app';
import { AppProviders, createQueryClient } from '../setup';

export function renderApp(route = '/login') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppProviders client={createQueryClient()}>
        <App />
      </AppProviders>
    </MemoryRouter>,
  );
}
