import type { Message } from '$lib/components/chat/types';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getSession } from '$lib/server/supabase/session';
import { ChatOpenAI } from '@langchain/openai';
import { error, type RequestEvent } from '@sveltejs/kit';
import { FlowEdge } from '@nouro/flow';
import { NOURO_FLOW_API_KEY } from '$env/static/private';

export async function POST({ request, locals }: RequestEvent) {
	const { session } = await getSession(locals);

	const { messages, uuid } = await request.json() as {
		messages: Message[];
		uuid: string;
	};

	const lastMessage = messages.at(-1);

	if (lastMessage?.type !== 'human') {
		error(400, 'Last message should be human');
	}

	const { openai_api_key } = await locals.supabase
		.from('credentials')
		.select('openai_api_key')
		.eq('user_id', session.user.id)
		.single()
		.then(_ => _.data as { openai_api_key?: string | null })

	if (!openai_api_key) {
		return error(400, 'Not found OpenAI API key!');
	}

	if (lastMessage.to === 'root') {
		const chat = new ChatOpenAI({
			openAIApiKey: openai_api_key,
			streaming: true,
			modelName: 'gpt-3.5-turbo-0125'
		});

		const stream = await chat.stream(messages.map(_ => {
			if (_.type === 'human') return new HumanMessage(_.content);
			else if (_.type === 'system') return new SystemMessage(_.content);
			else return new AIMessage(_.content);
		}));

		return new Response(
			new ReadableStream({
				async pull(controller) {
					for await (const streamElement of stream) {
						controller.enqueue(streamElement.content);
					}
					controller.close();
				},
			})
		)
	} else {
		const flowEdge = new FlowEdge(NOURO_FLOW_API_KEY);

		const res = await flowEdge.execute({
			session: {
				id: uuid
			},
			uuid: lastMessage.to,
			variables: {
				message: lastMessage.content
			},
		});

		return new Response(
			res.toStream()
		)
	}
}