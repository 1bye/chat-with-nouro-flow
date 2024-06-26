import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { session } = await locals.safeGetSession()

	if (!session) {
		throw redirect(303, '/')
	}

	return { session }
}