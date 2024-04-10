<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { settingsFormSchema, type SettingsFormSchema } from "./schema";
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import type { Credentials } from '$lib/types/credential';
	import { onMount } from 'svelte';

	export let data: {
		settingsForm: SuperValidated<Infer<SettingsFormSchema>>;
		credentials: Credentials;
	};

	const form = superForm(data.settingsForm, {
		validators: zodClient(settingsFormSchema),
	});

	const { form: formData, enhance, submitting } = form;

	onMount(() => {
		console.log(data);
		formData.update(value => {
			value["openai_api_key"] = data.credentials?.openai_api_key ?? "";
			return value;
		})
	})
</script>

<form action="?/saveCredentials" method="POST" use:enhance>
	<Form.Field {form} name="openai_api_key">
		<Form.Control let:attrs>
			<Form.Label>OpenAI API Key</Form.Label>
			<Input {...attrs} type="password" placeholder="Ex: sk-13231232155214q" bind:value={$formData.openai_api_key} />
		</Form.Control>
		<Form.Description>This is your OpenAI API Key.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full" loading={$submitting} disabled={$submitting}>Save</Form.Button>
</form>