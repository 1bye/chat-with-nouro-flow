<script lang="ts">
	import type { SettingsFormSchema } from '$lib/components/chat/settings/schema';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { Button } from '$lib/components/ui/button';
	import { ChatSettingsForm } from '$lib/components/chat/settings';
	import * as Dialog from "$lib/components/ui/dialog";
	import { Settings } from 'lucide-svelte';
	import type { Credentials } from '$lib/types/credential';
	import type { Message } from '$lib/components/chat/types';

	export let data: {
		settingsForm: SuperValidated<Infer<SettingsFormSchema>>;
		credentials: Credentials;
		chats: {
			messages: Message[]
		}
	};
</script>

<Dialog.Root>
	<Dialog.Trigger asChild let:builder>
		<Button variant="ghost" size="icon" builders={[builder]}>
			<Settings class="w-4 h-4" />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Settings</Dialog.Title>
			<Dialog.Description>
				Make changes to chat settings here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<ChatSettingsForm {data} />
	</Dialog.Content>
</Dialog.Root>