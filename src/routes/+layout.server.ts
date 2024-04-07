// src/routes/+layout.server.ts
import type { LayoutServerLoad } from '../../.svelte-kit/types/src/routes'

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession()

	return {
		session,
		user,
	}
}