<script lang="ts">
	import type { Message } from '$lib/components/chat/types';
	import { ChatController, ChatMessage } from '$lib/components/chat';
	import { readStream } from '$lib/stream';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { actionFetch } from '$lib/action';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	export let data;

	let value: string = '';
	let loading: boolean = false;
	let chosenBot: string | 'root' = 'root';

	const messages = writable<Message[]>([]);

	async function sendMessage() {
		loading = true;

		const res = await fetch("/api/chat/send", {
			method: "POST",
			body: JSON.stringify({
				messages: $messages,
				uuid: data.uuid
			})
		})

		if (!res.body)
			return toast.error("Failed to read message");

		messages.update(value => {
			value.push({
				type: "ai",
				content: "",
				to: "root",
				id: new Date().getTime()
			});

			return value;
		});

		await readStream({
			stream: res.body,
			end() {
				loading = false;
			},
			chunk(value) {
				console.log(value);
				if ($messages?.at(-1))
					$messages[$messages.length - 1].content += value;
			}
		});

		await saveMessages();
	}

	async function saveMessages() {
		await actionFetch("saveMessages", {
			messages: $messages,
			uuid: data.uuid
		})
	}

	async function continueConversation() {
		try {
			messages.update(_ => {
				_.push({
					type: "human",
					content: value,
					to: chosenBot,
					id: new Date().getTime()
				});

				return _;
			})

			await sendMessage();
		} catch (e) {
			toast.error("Failed to send message");
			loading = false;
		}
	}

	async function startChat() {
		const lastMessage = $messages.at(-1);

		if (lastMessage?.type === "human") {
			await sendMessage();
		}
	}

	onMount(() => {
		messages.set(
			data.chat?.messages ?? []
		);
		startChat();
	})

	$: messages.set(
		data.chat?.messages ?? []
	);
</script>

<div class="w-full h-full flex flex-col">
	<div class="w-full h-10 p-2 border-b">
		<span class="text-sm">{data.uuid}</span>
	</div>
	<div class="w-full h-full flex flex-col p-4">
		<div class="w-full h-[calc(100%-6rem)]">
			<ScrollArea class="w-full h-full">
				<div class="w-full h-fit flex flex-col">
					{#each $messages ?? [] as message}
						<ChatMessage {message} />
					{/each}
				</div>
			</ScrollArea>
		</div>
		<div class="w-full h-24 flex justify-center">
			<ChatController bots={data.bots} onSubmit={continueConversation} {loading} bind:value bind:chosenBot />
		</div>
	</div>
</div>