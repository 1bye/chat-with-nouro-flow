<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { invalidate } from '$app/navigation'
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte'
	import '../app.pcss'

	export let data

	let { supabase, session } = data
	$: ({ supabase, session } = data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => data.subscription.unsubscribe()
	})
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<Toaster />
<ModeWatcher />

<div class="bg-slate-50 dark:bg-slate-950 w-full h-screen">
	<slot />
</div>