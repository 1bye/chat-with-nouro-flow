import type { LoadEvent, RequestEvent } from '@sveltejs/kit';
import { getSession } from '$lib/server/supabase/session';
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { settingsFormSchema } from '$lib/components/chat/settings/schema';
import { createBotFormSchema } from '$lib/components/chat/bot/schema';

export async function load({ locals, depends }: RequestEvent & LoadEvent) {
	depends("chat:reload");
	const { session } = await getSession(locals);

	const [chats, credentials, bots, settingsForm, createBotForm] = await Promise.all([
		locals.supabase
			.from('chats')
			.select('*')
			.eq('user_id', session.user.id).then(_ => _.data),
		locals.supabase
			.from("credentials")
			.select("openai_api_key")
			.eq("user_id", session.user.id)
			.single().then(_ => _.data),
		locals.supabase.from("bots")
			.select("uuid, name")
			.eq("user_id", session.user.id)
			.then(_ => _.data ?? []),
		superValidate(zod(settingsFormSchema)),
		superValidate(zod(createBotFormSchema))
	]);

	return {
		bots,
		chats,
		credentials,
		settingsForm,
		createBotForm
	};
}