<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { user } from '$lib/authService';

  let users = $state([]);
  let loading = $state(true);
  let error = $state('');

  async function loadUsers() {
    try {
      users = await api.get('/users');
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function changeRole(userId: string, role: string) {
    try {
      await api.patch(`/users/${userId}/role`, { role });
      await loadUsers();
    } catch (e: any) {
      alert(e.message);
    }
  }

  onMount(loadUsers);
</script>

<div class="max-w-7xl mx-auto px-4 py-12">
  <div class="flex justify-between items-center mb-12">
    <div>
      <h1 class="text-3xl font-bold">Admin Dashboard</h1>
      <p class="text-neutral-500">Manage users and system roles</p>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center py-20">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>
  {:else if error}
    <div class="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-500">
      <p class="font-bold">Access Denied</p>
      <p class="text-sm">{error}</p>
    </div>
  {:else}
    <div class="overflow-x-auto bg-neutral-900/50 border border-neutral-800 rounded-3xl">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-neutral-800">
            <th class="px-8 py-6 text-xs font-semibold text-neutral-500 uppercase tracking-wider">User</th>
            <th class="px-8 py-6 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</th>
            <th class="px-8 py-6 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Role</th>
            <th class="px-8 py-6 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each users as u}
            <tr class="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
              <td class="px-8 py-4 font-medium">{u.name || 'N/A'}</td>
              <td class="px-8 py-4 text-neutral-400 text-sm">{u.email}</td>
              <td class="px-8 py-4">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter
                  {u.role === 'SUPERADMIN' ? 'bg-purple-500 text-white' : 
                   u.role === 'ADMIN' ? 'bg-indigo-500 text-white' : 
                   'bg-neutral-800 text-neutral-400'}">
                  {u.role}
                </span>
              </td>
              <td class="px-8 py-4">
                {#if u.id !== $user?.id && $user?.role === 'SUPERADMIN'}
                  <select 
                    onchange={(e) => changeRole(u.id, e.target.value)}
                    class="bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-2 py-1 focus:border-indigo-500 outline-none"
                    value={u.role}
                  >
                    <option value="USER">Make User</option>
                    <option value="ADMIN">Make Admin</option>
                    <option value="SUPERADMIN">Make Superadmin</option>
                  </select>
                {:else}
                  <span class="text-xs text-neutral-600">No actions</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
