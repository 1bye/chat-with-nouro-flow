import type { Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createBotFormSchema } from '$lib/components/chat/bot/schema';
import { error, fail } from '@sveltejs/kit';
import { getSession } from '$lib/server/supabase/session';
import { FlowClient } from '@nouro/flow';
import { NOURO_FLOW_API_KEY } from '$env/static/private';


export const botActions = {
	createBot: async (event) => {
		try {
			const { locals } = event;

			const form = await superValidate(event, zod(createBotFormSchema));
			if (!form.valid) {
				return fail(400, {
					form,
				});
			}
			const { name, description } = form.data;

			const { session } = await getSession(locals);

			const client = new FlowClient({
				apiKey: NOURO_FLOW_API_KEY
			});

			const { openai_api_key } = await locals.supabase
				.from('credentials')
				.select('openai_api_key')
				.eq('user_id', session.user.id)
				.single()
				.then(_ => _.data as { openai_api_key?: string | null })

			if (!openai_api_key) {
				return error(400, 'Not found OpenAI API key!');
			}

			const { uuid, password } = await client.createAssignedFlow({
				flow: {
					type: "edge",
					name,
					description,
					credentials: [
						{
							name: "OpenAI API Key",
							credential_id: {
								name: "openAI"
							},
							inputs: [
								{
									name: "openAIApiKey",
									value: openai_api_key
								}
							]
						}
					],
					variables: [
						{
							name: "message",
							type: "string",
							value: ""
						}
					]
				},
				assign: {
					type: "password"
				}
			})

			await locals.supabase
				.from("bots")
				.insert({
					user_id: session.user.id,
					description,
					password,
					name,
					uuid
				});

			return {
				form,
			};
		} catch (e) {
			console.log(e);
		}
	},
} as Actions