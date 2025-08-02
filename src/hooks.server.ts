import { jwtDecode } from 'jwt-decode';
import type { Handle } from '@sveltejs/kit';

type JwtPayload = {
  email: string;
  roles: string[];
  exp?: number;
  iat?: number;
};

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('jwt');

  if (token) {
    try {
      const payload = jwtDecode<JwtPayload>(token);
      event.locals.user = payload;
    } catch (err) {
      console.error('Invalid JWT', err);
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};