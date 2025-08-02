import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	// Si déjà loggué → on redirige vers /admin
	if (cookies.get('jwt')) {
		throw redirect(303, '/admin');
	}

	const error = url.searchParams.get('error') ?? '';
	const email = url.searchParams.get('email') ?? '';

	return { error, email };
};

export const actions: Actions = {
	default: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');

		if (typeof email !== 'string' || typeof password !== 'string') {
			const q = new URLSearchParams({ error: 'Formulaire invalide', email: String(email) });
			throw redirect(303, `/login?${q}`);
		}

		const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		if (!res.ok) {
			const q = new URLSearchParams({ error: 'Identifiants invalides', email });
			throw redirect(303, `/login?${q}`);
		}

		const { token } = await res.json();

		// Cookie sécurisé, côté serveur uniquement
		cookies.set('jwt', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24
		});

		throw redirect(303, '/admin');
	}
};