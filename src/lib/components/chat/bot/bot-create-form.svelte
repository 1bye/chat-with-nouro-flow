<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { createBotFormSchema, type CreateBotFormSchema } from "./schema";
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Textarea } from '$lib/components/ui/textarea';

	export let data: SuperValidated<Infer<CreateBotFormSchema>>
	const form = superForm(data, {
		validators: zodClient(createBotFormSchema),
	});

	const { form: formData, enhance, submitting } = form;
</script>

<form action="?/createBot" method="POST" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Bot name</Form.Label>
			<Input {...attrs} placeholder="Ex: Weather Bot or WebSite Assistant etc..." bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Bot description</Form.Label>
			<Textarea {...attrs} placeholder="Ex: My weather bot, allows search current weather in any city etc..." bind:value={$formData.description} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button class="w-full" loading={$submitting} disabled={$submitting}>Create</Form.Button>
</form>