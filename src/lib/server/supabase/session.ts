import { redirect, type RequestEvent } from '@sveltejs/kit';
import type { Session, User } from '@supabase/supabase-js';

export async function getSession(locals: RequestEvent["locals"]) {
	const session = await locals.safeGetSession();

	if (!session) {
		throw redirect(303, '/')
	}

	return {
		session: session.session as Session,
		user: session.user as User
	};
}