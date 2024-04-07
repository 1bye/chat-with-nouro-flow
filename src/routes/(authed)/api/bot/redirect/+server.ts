import type { RequestEvent } from '@sveltejs/kit';
import { getSession } from '$lib/server/supabase/session';
import { error as Error } from '@sveltejs/kit';
import { FlowClient } from "@nouro/flow"


export async function GET({ url, locals }: RequestEvent) {
	const uuid = url.searchParams.get("uuid");

	if (!uuid) {
		return Error(400, "Not found uuid");
	}

	const { session } = await getSession(locals);

	const { data, error } = await locals.supabase
		.from("bots")
		.select("password")
		.eq("user_id", session.user.id)
		.eq("uuid", uuid)
		.single();

	if (data && !error) {
		return new Response(null, {
			status: 302,
			headers: {
				"Location": FlowClient.generateAssignedFlowLink(uuid, {
					directPassword: data.password
				})
			}
		})
	}

	Error(500, "Failed redirect")
}