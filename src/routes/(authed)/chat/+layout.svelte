<script lang="ts">
	import type { SettingsFormSchema } from '$lib/components/chat/settings/schema';
	import type { CreateBotFormSchema } from '$lib/components/chat/bot/schema';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { Bot, Credentials } from '$lib/types/credential';
	import { ChatCreateBot, ChatSettings } from '$lib/components/chat';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Resizable from "$lib/components/ui/resizable";

	export let data: {
		settingsForm: SuperValidated<Infer<SettingsFormSchema>>;
		createBotForm: SuperValidated<Infer<CreateBotFormSchema>>;
		credentials: Credentials;
		chats: {
			uuid: string;
		}[];
		bots: Bot[]
	};
</script>

<Resizable.PaneGroup direction="horizontal" class="w-full rounded-lg border">
	<Resizable.Pane defaultSize={10} minSize={10} maxSize={12}>
		<div class="w-full h-full flex flex-col justify-between">
			<div class="w-full h-full flex flex-col">
				<div class="text-sm flex items-center font-medium text-slate-500 p-2 h-10 border-b">
					Chats:
				</div>
				<ScrollArea class="max-h-72 border-b">
					<div class="w-full h-fit p-2">
						{#each data.chats as chat}
							<Button class="w-full" href="/chat/{chat.uuid}" variant="ghost">
								{chat.uuid?.split("-")?.[0]}
							</Button>
						{/each}
					</div>
				</ScrollArea>
				<div class="text-sm flex items-center font-medium text-slate-500 p-2 h-10 border-b">
					Bots:
				</div>
				<ScrollArea class="max-h-72 border-b">
					<div class="w-full h-fit p-2">
						{#each data.bots as bot}
							<Button class="w-full" target="_blank" href="/api/bot/redirect?uuid={bot.uuid}" variant="ghost">
								{bot.name}
							</Button>
						{/each}
					</div>
				</ScrollArea>
			</div>
			<div class="w-full flex justify-center py-2 h-fit">
				<ChatSettings data={{
					settingsForm: data.settingsForm,
					credentials: data.credentials
				}} />
				<ChatCreateBot data={data.createBotForm} />
			</div>
		</div>
	</Resizable.Pane>
	<Resizable.Handle />
	<Resizable.Pane defaultSize={50}>
		<slot />
	</Resizable.Pane>
</Resizable.PaneGroup>
