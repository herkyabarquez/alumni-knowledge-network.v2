<script lang="ts">
	import { onMount } from 'svelte';
	import { initAuth, loading } from '$lib/authService';
	import Navbar from '$lib/components/Navbar.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	onMount(async () => {
		await initAuth();
	});
</script>

<svelte:head>
	<link rel="icon" href="/logo.png?v=4" />
</svelte:head>

{#if $loading}
	<div class="fixed inset-0 flex flex-col items-center justify-center bg-neutral-950 gap-6">
		<img src="/logo.png?v=4" alt="AKN Logo" class="h-16 w-auto invert animate-pulse opacity-50" />
		<div
			class="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500"
		></div>
	</div>
{:else}
	<Navbar />
	<main>
		{@render children()}
	</main>
{/if}

