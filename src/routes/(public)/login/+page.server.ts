import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';

const API_BASE = process.env.PUBLIC_API_BASE ?? 'http://localhost:8000';
const COOKIE_NAME = 'jwt'; // Must match Symfony's cookie name if backend reads it

// Sanitize "next" param to avoid open redirects
function sanitizeNext(next: string | null | undefined): string | null {
  if (!next) return null;
  if (next.startsWith('http://') || next.startsWith('https://')) return null;
  if (!next.startsWith('/')) return null;
  if (next.startsWith('//')) return null;
  return next;
}

export const load: PageServerLoad = async ({ locals, url }) => {
  // Redirect authenticated users away from /login
  if (locals.user) {
    const next = sanitizeNext(url.searchParams.get('next'));
    if (locals.user.roles?.includes('ROLE_ADMIN')) {
      throw redirect(303, next ?? '/admin');
    }
    throw redirect(303, next ?? '/');
  }

  // Allow rendering login form
  const error = url.searchParams.get('error') ?? '';
  const email = url.searchParams.get('email') ?? '';
  return { error, email };
};

export const actions: Actions = {
  default: async ({ request, cookies, url, fetch }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    if (!email || !password) {
      return fail(400, { message: 'Email and password are required.' });
    }

    const resp = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });

    if (!resp.ok) {
      return fail(resp.status, { message: 'Invalid credentials.' });
    }

    let data: unknown;
    try {
      data = await resp.json();
    } catch {
      // If API sets cookie directly, JSON parse may fail – that's fine
    }

    const token = (data as { token?: string } | undefined)?.token;
    if (token) {
      cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',   // For same-site; use 'none' + secure: true for cross-site HTTPS
        secure: !dev,
        maxAge: 60 * 60 * 24 * 7
      });
    }

    const next = sanitizeNext(url.searchParams.get('next')) ?? '/';
    
    throw redirect(303, next);
  }
};
