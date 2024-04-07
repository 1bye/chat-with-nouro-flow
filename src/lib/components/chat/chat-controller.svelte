<script lang="ts">
	import type { Bot } from '$lib/types/credential';
	import { BotIcon, ForwardIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import * as Popover from '$lib/components/ui/popover';
	import X from 'lucide-svelte/icons/x';

	type $$Props = {
		value: string;
		loading?: boolean;
		maxLength?: number;
		onSubmit?: (value: $$Props['value']) => void;
		bots?: Bot[];
		chosenBot?: 'root' | string;
	}

	const baseLength = 2048;

	export let value: $$Props['value'] = '';
	export let chosenBot: $$Props['chosenBot'] = 'root';
	export let maxLength: $$Props['maxLength'] = baseLength;
	export let onSubmit: $$Props['onSubmit'] = undefined;
	export let loading: $$Props['loading'] = false;
	export let bots: $$Props['bots'] = [];

	let botPopoverShown: boolean = false;

	function chooseBot(bot: Bot) {
		chosenBot = bot.uuid;
		botPopoverShown = false;
	}

	$: valid = value.length > (maxLength ?? baseLength) || value === '' || loading;
</script>

<div class="w-[32rem] h-fit flex flex-col">
	<div
		class="w-full group focus-within:ring-blue-400 focus-within:ring-2 border-2 border-slate-800 overflow-hidden h-fit shadow-sm bg-white dark:bg-slate-900 rounded-lg flex flex-col items-center">
		<div class="w-full h-6 flex items-center justify-between px-2 bg-slate-800">
			<Popover.Root bind:open={botPopoverShown}>
				<Popover.Trigger class="flex">
					<span class="text-xs text-slate-400 font-medium hover:text-slate-300 cursor-pointer select-none">
						{#if !chosenBot || chosenBot === 'root'}
							Choose bot
						{:else}
							{bots?.find(_ => _.uuid === chosenBot)?.name ?? 'Choose bot'}
						{/if}
					</span>
				</Popover.Trigger>
				<Popover.Content side="top" align="start" class="p-1 w-48" alignOffset={-10} sideOffset={10}>
					{#each (bots ?? []) as bot}
						<Button on:click={() => chooseBot(bot)} size="sm" variant="ghost" class="w-full justify-start">
							<BotIcon class="w-4 h-4 mr-4" />
							{bot.name}
						</Button>
					{/each}
				</Popover.Content>
			</Popover.Root>
			<Button on:click={() => chosenBot = 'root'} variant="ghost" class="w-fit h-fit p-0">
				<X class="w-4 h-4 cursor-pointer dark:text-slate-400 dark:hover:text-slate-300" />
			</Button>
		</div>
		<div class="flex w-full h-fit items-center">
			<textarea placeholder="Write something" bind:value
					  class="w-full h-full outline-none text-sm p-2 resize-none rounded-lg dark:bg-slate-900 dark:text-slate-400"></textarea>
			<Button size="icon" {loading} on:click={() => onSubmit?.(value)} disabled={valid} variant="ghost"
					class="mr-2 px-3 dark:hover:bg-slate-700">
				<ForwardIcon class="rotate-180 w-4 h-4 text-slate-400" />
			</Button>
		</div>
	</div>
	<div class="w-full h-fit flex justify-between px-2 py-0.5">
		<span class="text-xs text-slate-400 dark:text-slate-600">This is chat example using nouro flow</span>
		<span
			class={cn("text-xs text-slate-400 dark:text-slate-600", value.length > (maxLength ?? baseLength) && "text-red-400")}>{value.length}
			/ {maxLength}</span>
	</div>
</div>