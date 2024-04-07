<script lang="ts">
	import type { Message } from '$lib/components/chat/types';
	import { Markdown } from 'svelte-exmarkdown';
	import { Bot, CircleUserRound } from 'lucide-svelte';

	type $$Props = {
		message: Message;
	}

	export let message: $$Props['message'];
</script>

<div class="w-full h-fit flex px-4 py-4 hover:bg-slate-800 rounded-lg">
	<div class="w-fit h-fit mr-2">
		{#if message.type === 'human'}
			<CircleUserRound class="w-5 h-5 flex-shrink-0" />
		{:else}
			<Bot class="w-5 h-5 flex-shrink-0" />
		{/if}
	</div>
	<div class="w-full h-fit text-sm">
		{#if typeof message.content === 'object'}
			<pre>
				{JSON.stringify(message.content, null, 2)}
			</pre>
		{:else}
			<Markdown md={message.content} />
		{/if}
	</div>
</div>