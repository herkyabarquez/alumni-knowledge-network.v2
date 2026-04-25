<script lang="ts">
  import { user, isAuthenticated, login, logout } from '$lib/authService';
</script>

<nav class="border-b border-neutral-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 justify-between items-center">
      <div class="flex items-center">
        <a href="/" class="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          AKN
        </a>
        <div class="hidden sm:ml-10 sm:flex sm:space-x-8">
          <a href="/feed" class="text-neutral-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Feed</a>
          <a href="/mentorship" class="text-neutral-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Mentorship</a>
          {#if $user?.role === 'ADMIN' || $user?.role === 'SUPERADMIN'}
            <a href="/admin" class="text-neutral-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Admin</a>
          {/if}
        </div>
      </div>
      <div class="flex items-center gap-4">
        {#if $isAuthenticated}
          <a href="/profile/me" class="flex items-center gap-2 group">
            <span class="text-sm text-neutral-300 group-hover:text-white transition-colors">{$user?.name || 'Profile'}</span>
            <div class="h-8 w-8 rounded-full bg-neutral-800 overflow-hidden">
              {#if $user?.profilePic}
                <img src={$user.profilePic} alt="Profile" class="h-full w-full object-cover" />
              {:else}
                <div class="h-full w-full flex items-center justify-center text-xs">?</div>
              {/if}
            </div>
          </a>
          <button
            onclick={logout}
            class="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        {:else}
          <button
            onclick={login}
            class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200 transition-all"
          >
            Sign in
          </button>
        {/if}
      </div>
    </div>
  </div>
</nav>
