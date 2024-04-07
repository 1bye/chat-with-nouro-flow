import { type Actions, error, fail } from '@sveltejs/kit';
import { getSession } from '$lib/server/supabase/session';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { settingsFormSchema } from '$lib/components/chat/settings/schema';
import { botActions } from '$lib/server/actions/bot';

export const actions: Actions = {
	createChat: async ({ locals, request }) => {
		const { value, to } = await request.json() as {
			value?: string;
			to: 'root' | string;
		}

		if (!value) {
			error(400, "Not found value");
		}

		const { session } = await getSession(locals);

		return await locals.supabase
			.from("chats")
			.insert({
				user_id: session.user.id,
				messages: [
					{
						id: new Date().getTime(),
						type: "human",
						content: value,
						to
					}
				]
			})
			.select("uuid")
			.single()
			.then(_ => _.data)
	},
	saveCredentials: async (event) => {
		const { locals } = event;

		const { session } = await getSession(locals);

		const form = await superValidate(event, zod(settingsFormSchema));
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}

		const { openai_api_key } = form.data;
		await locals.supabase
			.from("credentials")
			.upsert({
				user_id: session.user.id,
				openai_api_key
			}, {
				onConflict: "user_id"
			});

		return {
			form,
		};
	},
	...botActions
}