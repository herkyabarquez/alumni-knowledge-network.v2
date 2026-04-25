<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { api } from '$lib/api';
  import { user } from '$lib/authService';

  let profileUser = $state(null);
  let loading = $state(true);
  let isEditing = $state(false);
  let editData = $state({ bio: '', industry: '', batch: '' });
  let isMyProfile = $derived(page.params.id === 'me' || profileUser?.id === $user?.id);

  async function loadProfile() {
    try {
      const id = page.params.id === 'me' ? 'me' : page.params.id;
      profileUser = await api.get(`/users/${id}`);
      editData = {
        bio: profileUser.bio || '',
        industry: profileUser.industry || '',
        batch: profileUser.batch || ''
      };
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function handleUpdate() {
    try {
      const updated = await api.patch('/users/me', editData);
      profileUser = { ...profileUser, ...updated };
      isEditing = false;
    } catch (e) {
      console.error(e);
    }
  }

  onMount(loadProfile);
</script>

<div class="max-w-4xl mx-auto px-4 py-20">
  {#if loading}
    <div class="flex justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>
  {:else if profileUser}
    <div class="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-10">
      <div class="flex flex-col md:flex-row gap-10 items-start">
        <div class="h-32 w-32 rounded-full bg-neutral-800 overflow-hidden flex-shrink-0">
          {#if profileUser.profilePic}
            <img src={profileUser.profilePic} alt="Profile" class="h-full w-full object-cover" />
          {:else}
            <div class="h-full w-full flex items-center justify-center text-4xl">👤</div>
          {/if}
        </div>

        <div class="flex-grow space-y-4">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-4xl font-bold">{profileUser.name}</h1>
              <p class="text-neutral-500">{profileUser.email}</p>
            </div>
            {#if isMyProfile && !isEditing}
              <button
                onclick={() => isEditing = true}
                class="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-full transition-all"
              >
                Edit Profile
              </button>
            {/if}
          </div>

          {#if isEditing}
            <div class="space-y-4 pt-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-neutral-500 uppercase mb-1">Industry</label>
                  <input
                    bind:value={editData.industry}
                    placeholder="e.g. Software Engineering"
                    class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-neutral-500 uppercase mb-1">Batch</label>
                  <input
                    bind:value={editData.batch}
                    placeholder="e.g. 2020"
                    class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-neutral-500 uppercase mb-1">Bio</label>
                <textarea
                  bind:value={editData.bio}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:border-indigo-500"
                ></textarea>
              </div>
              <div class="flex gap-4 pt-2">
                <button
                  onclick={handleUpdate}
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-semibold transition-all"
                >
                  Save Changes
                </button>
                <button
                  onclick={() => isEditing = false}
                  class="text-neutral-400 hover:text-white px-4 py-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          {:else}
            <div class="grid grid-cols-2 gap-8 py-4">
              <div>
                <h3 class="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Industry</h3>
                <p class="text-lg text-neutral-200">{profileUser.industry || 'Not specified'}</p>
              </div>
              <div>
                <h3 class="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Batch</h3>
                <p class="text-lg text-neutral-200">{profileUser.batch || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <h3 class="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Bio</h3>
              <p class="text-neutral-400 leading-relaxed">{profileUser.bio || 'This user hasn\'t shared a bio yet.'}</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <div class="text-center py-20">
      <h1 class="text-2xl font-bold mb-4">User not found</h1>
      <a href="/feed" class="text-indigo-500 hover:underline">Back to feed</a>
    </div>
  {/if}
</div>
