import { setupWorker } from 'msw/browser';
import { handlers } from './routes';

export const worker = setupWorker(...handlers);
