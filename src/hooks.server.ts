// src/hooks.server.ts
import { SUPABASE_DB_KEY, SUPABASE_DB_URL } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = createServerClient(SUPABASE_DB_URL,SUPABASE_DB_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' })
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' })
			},
		},
	});

	event.locals.supabase = supabase;

	/**
	 * Unlike `supabase.auth.getSession`, which is unsafe on the server because it
	 * doesn't validate the JWT, this function validates the JWT by first calling
	 * `getUser` and aborts early if the JWT signature is invalid.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()
		if (error) {
			return { session: null, user: null }
		}

		const {
			data: { session },
		} = await event.locals.supabase.auth.getSession()
		return { session, user }
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range'
		},
	})
};