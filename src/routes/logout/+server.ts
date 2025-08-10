import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const COOKIE_NAME = 'jwt';

export const POST: RequestHandler = async ({ cookies, request, url }) => {
  // Optional CSRF-style origin check (keeps things safer for POST forms)
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== url.host) {
    return new Response('Invalid origin', { status: 403 });
  }

  // Delete the auth cookie; path must match the one used when setting it
  cookies.delete(COOKIE_NAME, {
    path: '/'
  });

  // Redirect to home
  throw redirect(303, '/');
};

// Optional: allow GET /logout for convenience (e.g., if someone hits the URL directly)
// Prefer POST in production to avoid accidental/cross-site logouts.
export const GET: RequestHandler = async ({ cookies }) => {
  cookies.delete(COOKIE_NAME, { path: '/' });
  throw redirect(303, '/');
};
