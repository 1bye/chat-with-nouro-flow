<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { Button } from '$lib/components/ui/button';

	export let data

	let { session, supabase } = data
	$: ({ session, supabase } = data)

	let loading = false

	const handleSignOut: SubmitFunction = () => {
		loading = true
		return async ({ update }) => {
			loading = false
			update()
		}
	}
</script>

<Button href="/chat">
	Go to chat
</Button>

<form method="post" action="?/signOut" use:enhance={handleSignOut}>
	<Button variant="destructive" type="submit" disabled={loading}>Sign Out</Button>
</form>