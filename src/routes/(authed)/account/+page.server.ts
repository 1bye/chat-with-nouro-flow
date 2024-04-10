import type { Actions } from '@sveltejs/kit';
import { getSession } from '$lib/server/supabase/session';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	signOut: async ({ locals }) => {
		await getSession(locals);

		await locals.supabase.auth.signOut();

		redirect(302, "/");
	}
}