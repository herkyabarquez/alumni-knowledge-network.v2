<script lang="ts">
  import { onMount } from 'svelte';
  import { authService } from '$lib/authService';
  import { fade, fly } from 'svelte/transition';

  onMount(() => {
    // Ensure they are actually logged out when reaching this page
    authService.logout();
  });
</script>

<svelte:head>
  <title>Account Restricted | AKN</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 font-['Inter']">
  <div 
    in:fly={{ y: 20, duration: 800 }}
    class="max-w-md w-full bg-[#111] border border-red-900/30 rounded-2xl p-8 text-center shadow-2xl shadow-red-900/10"
  >
    <div in:fade={{ delay: 200 }} class="mb-6 flex justify-center">
      <div class="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center border border-red-500/30 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    </div>

    <h1 class="text-3xl font-bold text-white mb-4">Access Restricted</h1>
    
    <p class="text-gray-400 mb-8 leading-relaxed">
      Your account has been restricted from accessing the Alumni Knowledge Network for violating our community standards.
    </p>

    <div class="space-y-4">
      <a 
        href="mailto:support@neu.edu.ph"
        class="block w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all duration-300"
      >
        Contact Support
      </a>
      
      <button 
        on:click={() => window.location.href = '/login'}
        class="text-sm text-gray-500 hover:text-white transition-colors"
      >
        Return to Sign In
      </button>
    </div>

    <div class="mt-12 pt-8 border-t border-white/5">
      <p class="text-xs text-gray-600 uppercase tracking-widest font-semibold">
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
