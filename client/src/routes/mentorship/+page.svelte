<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { user, isAuthenticated } from '$lib/authService';

  let requests = $state([]);
  let alumniList = $state([]);
  let loading = $state(true);
  let search = $state({ industry: '', batch: '' });
  let requestMessage = $state('');
  let selectedAlumni = $state(null);

  async function loadData() {
    try {
      const [reqs, alums] = await Promise.all([
        api.get('/mentorship/my-requests'),
        api.get(`/users?industry=${search.industry}&batch=${search.batch}`)
      ]);
      requests = reqs;
      alumniList = alums;
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function sendRequest() {
    if (!selectedAlumni || !requestMessage) return;
    try {
      await api.post('/mentorship/request', {
        alumniId: selectedAlumni.id,
        message: requestMessage
      });
      requestMessage = '';
      selectedAlumni = null;
      await loadData();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleResponse(id: string, status: string) {
    try {
      await api.patch(`/mentorship/${id}/respond`, { status });
      await loadData();
    } catch (e) {
      console.error(e);
    }
  }

  onMount(loadData);
</script>

<div class="max-w-6xl mx-auto px-4 py-12 space-y-16">
  <section>
    <h1 class="text-3xl font-bold mb-8">Mentorship Center</h1>
    
    {#if $isAuthenticated}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- My Requests -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold">My Requests</h2>
          {#if requests.length === 0}
            <p class="text-neutral-500 italic">No active requests.</p>
          {:else}
            <div class="space-y-4">
              {#each requests as req}
                <div class="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <p class="text-sm text-neutral-500">
                        {req.studentId === $user?.id ? 'To:' : 'From:'}
                        <span class="text-neutral-200 font-medium">
                          {req.studentId === $user?.id ? req.alumni.name : req.student.name}
                        </span>
                      </p>
                      <p class="text-xs text-neutral-600">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      {req.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 
                       req.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-500' : 
                       'bg-red-500/10 text-red-500'}">
                      {req.status}
                    </span>
                  </div>
                  <p class="text-neutral-400 text-sm italic mb-4">"{req.message}"</p>
                  
                  {#if req.alumniId === $user?.id && req.status === 'PENDING'}
                    <div class="flex gap-2">
                      <button onclick={() => handleResponse(req.id, 'ACCEPTED')} class="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">Accept</button>
                      <button onclick={() => handleResponse(req.id, 'DECLINED')} class="flex-grow bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">Decline</button>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Find Alumni -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold">Find an Alumni</h2>
          <div class="flex gap-2">
            <input 
              bind:value={search.industry} 
              oninput={loadData}
              placeholder="Filter by Industry" 
              class="flex-grow bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-sm focus:border-indigo-500 transition-colors" 
            />
          </div>
          
          <div class="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-800">
            {#each alumniList.filter(a => a.id !== $user?.id) as alum}
              <div class="bg-neutral-900/30 border border-neutral-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h3 class="font-bold">{alum.name}</h3>
                  <p class="text-xs text-neutral-500">{alum.industry || 'General'} • Batch {alum.batch || 'N/A'}</p>
                </div>
                <button 
                  onclick={() => selectedAlumni = alum}
                  class="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Request
                </button>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center py-20 bg-neutral-900/30 rounded-3xl border border-neutral-800">
        <p class="text-neutral-400 mb-6">Please sign in to access the mentorship system.</p>
        <button onclick={() => window.location.href = '/'} class="bg-white text-black px-8 py-2 rounded-full font-bold">Sign In</button>
      </div>
    {/if}
  </section>
</div>

{#if selectedAlumni}
  <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div class="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-3xl p-8 space-y-6 shadow-2xl">
      <div>
        <h2 class="text-2xl font-bold">Request Mentorship</h2>
        <p class="text-neutral-500">To: <span class="text-white font-medium">{selectedAlumni.name}</span></p>
      </div>
      <textarea 
        bind:value={requestMessage}
        placeholder="Introduce yourself and explain why you're seeking mentorship..."
        rows="5"
        class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-colors"
      ></textarea>
      <div class="flex gap-4">
        <button onclick={sendRequest} class="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all active:scale-95">Send Request</button>
        <button onclick={() => selectedAlumni = null} class="px-6 py-3 text-neutral-400 hover:text-white font-medium">Cancel</button>
      </div>
    </div>
  </div>
{/if}
