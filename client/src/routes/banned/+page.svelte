<script lang="ts">
	import { onMount } from 'svelte';
	import * as authService from '$lib/authService';
	import { fade, fly } from 'svelte/transition';

	onMount(() => {
		// Ensure they are actually logged out when reaching this page
		authService.logout();
	});
</script>

<svelte:head>
	<title>Account Restricted | AKN</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4 font-['Inter']">
	<div
		in:fly={{ y: 20, duration: 800 }}
		class="w-full max-w-md rounded-2xl border border-red-900/30 bg-[#111] p-8 text-center shadow-2xl shadow-red-900/10"
	>
		<div in:fade={{ delay: 200 }} class="mb-6 flex justify-center">
			<div
				class="flex h-20 w-20 animate-pulse items-center justify-center rounded-full border border-red-500/30 bg-red-900/20"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-10 w-10 text-red-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			</div>
		</div>

		<h1 class="mb-4 text-3xl font-bold text-white">Access Restricted</h1>

		<p class="mb-8 leading-relaxed text-gray-400">
			Your account has been restricted from accessing the Alumni Knowledge Network for violating our
			community standards.
		</p>

		<div class="space-y-4">
			<a
				href="mailto:support@neu.edu.ph"
				class="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/10"
			>
				Contact Support
			</a>

			<button
				onclick={() => (window.location.href = '/login')}
				class="text-sm text-gray-500 transition-colors hover:text-white"
			>
				Return to Sign In
			</button>
		</div>

		<div class="mt-12 border-t border-white/5 pt-8">
			<p class="text-xs font-semibold tracking-widest text-gray-600 uppercase">
				Alumni Knowledge Network &copy; 2026
			</p>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: #0a0a0a;
		margin: 0;
	}
</style>
