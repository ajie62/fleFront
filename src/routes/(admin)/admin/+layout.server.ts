import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const user = locals.user;

  if (!user) {
    // Not logged-in → go to login with next param
    throw redirect(303, `/login?next=${encodeURIComponent(url.pathname)}`);
  }

  if (!user.roles?.includes('ROLE_ADMIN')) {
    // Logged-in but not admin → go somewhere safe (not /login)
    throw redirect(303, '/');
  }

  return { user };
};
