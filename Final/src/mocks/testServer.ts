import { setupServer } from 'msw/node';
import { handlers } from './routes';

export const server = setupServer(...handlers);
