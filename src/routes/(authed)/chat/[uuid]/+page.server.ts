import type { Actions, RequestEvent } from '@sveltejs/kit';
import { getSession } from '$lib/server/supabase/session';
import type { Message } from '$lib/components/chat/types';
import { botActions } from '$lib/server/actions/bot';

export async function load({ locals, params }: RequestEvent) {
	const { session } = await getSession(locals);

	return {
		chat: await locals.supabase
			.from("chats")
			.select("*")
			.eq("user_id", session.user.id)
			.eq("uuid", params.uuid)
			.single()
			.then(_ => _.data),
		uuid: params.uuid
	}
}

export const actions: Actions = {
	saveMessages: async ({ locals, request }) => {
		const { session } = await getSession(locals);

		const { uuid, messages } = await request.json() as {
			messages: Message[];
			uuid: string;
		}

		await locals.supabase
			.from('chats')
			.update({
				messages
			})
			.eq('user_id', session.user.id)
			.eq('uuid', uuid);
	},
	...botActions
}