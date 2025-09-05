import { edenFetch, treaty } from '@elysiajs/eden';
import { APP } from '../api';

export const api = treaty<APP>(
  typeof window === 'undefined'
    ? `http://localhost:${process.env.PORT ?? 3000}`
    : window.location.origin
).api;
export const fetch = edenFetch<APP>('http://localhost:3000')
