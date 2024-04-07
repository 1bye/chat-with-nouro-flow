<script lang="ts">
	import type { CreateBotFormSchema } from '$lib/components/chat/bot/schema';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import { FormCreateBot } from '$lib/components/chat/bot';
	import * as Dialog from "$lib/components/ui/dialog";

	export let data: SuperValidated<Infer<CreateBotFormSchema>>;
</script>

<Dialog.Root>
	<Dialog.Trigger asChild let:builder>
		<Button variant="ghost" size="sm" builders={[builder]}>
			<Plus class="w-4 h-4 mr-2" />
			Create Bot
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create bot</Dialog.Title>
			<Dialog.Description>
				With bot you van control flow of ai, make your own response from bot
			</Dialog.Description>
		</Dialog.Header>
		<FormCreateBot {data} />
	</Dialog.Content>
</Dialog.Root>