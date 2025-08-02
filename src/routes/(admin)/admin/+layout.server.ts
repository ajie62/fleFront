import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user;

  if (!user || !user.roles?.includes('ROLE_ADMIN')) {
    throw redirect(303, '/login'); // ou une page d'erreur publique
  }

  return {
    user
  };
};
