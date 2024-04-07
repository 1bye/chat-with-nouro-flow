<script lang="ts">
	import { ChatController } from '$lib/components/chat';
	import { toast } from 'svelte-sonner';
	import { actionFetch } from '$lib/action';
	import { goto } from '$app/navigation';

	let value: string = "";
	let loading: boolean = false;
	let chosenBot: string | 'root' = 'root';

	export let data;

	async function createChat(value: string) {
		try {
			loading = true;
			const { uuid } = await actionFetch<{
				uuid?: string;
			}>('createChat', {
				value,
				to: chosenBot
			});

			if (!uuid) {
				return toast.error('Failed to create new chat');
			}

			await goto(`/chat/${uuid}`);
			loading = false;
		} catch (e) {
			console.log(e);
			toast.error('Failed to create new chat');
			loading = false;
		}
	}
</script>

<div class="w-full h-full flex flex-col p-4">
	<div class="w-full h-full">

	</div>
	<div class="w-full max-h-16 flex justify-center">
		<ChatController bind:value bind:chosenBot bots={data.bots} {loading} onSubmit={createChat} />
	</div>
</div>