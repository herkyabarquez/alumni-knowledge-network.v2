<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { isAuthenticated } from '$lib/authService';

  let posts = $state([]);
  let loading = $state(true);
  let newPost = $state({ title: '', content: '' });
  let error = $state('');

  async function loadPosts() {
    try {
      posts = await api.get('/posts');
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    try {
      const created = await api.post('/posts', newPost);
      posts = [created, ...posts];
      newPost = { title: '', content: '' };
    } catch (e: any) {
      error = e.message;
    }
  }

  onMount(loadPosts);
</script>

<div class="max-w-4xl mx-auto px-4 py-12">
  <div class="flex justify-between items-center mb-12">
    <h1 class="text-3xl font-bold">Knowledge Feed</h1>
    {#if $isAuthenticated}
      <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
        Create Post
      </button>
    {/if}
  </div>

  {#if $isAuthenticated}
    <form onsubmit={handleSubmit} class="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl mb-12 space-y-4">
      <h2 class="text-xl font-semibold mb-2">Share your knowledge</h2>
      <input
        bind:value={newPost.title}
        placeholder="Title"
        class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
      />
      <textarea
        bind:value={newPost.content}
        placeholder="What's on your mind?"
        rows="4"
        class="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
      ></textarea>
      {#if error}
        <p class="text-red-500 text-sm">{error}</p>
      {/if}
      <button
        type="submit"
        class="bg-white text-black font-semibold px-6 py-2 rounded-lg hover:bg-neutral-200 transition-all active:scale-95"
      >
        Post
      </button>
    </form>
  {/if}

  {#if loading}
    <div class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>
  {:else if posts.length === 0}
    <div class="text-center py-20 bg-neutral-900/30 rounded-3xl border border-dashed border-neutral-800">
      <p class="text-neutral-500">No posts yet. Be the first to share something!</p>
    </div>
  {:else}
    <div class="space-y-6">
      {#each posts as post}
        <div class="bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl hover:border-neutral-700 transition-all group">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-2xl font-bold mb-1 group-hover:text-indigo-400 transition-colors">{post.title}</h3>
              <div class="flex items-center gap-2 text-sm text-neutral-500">
                <span class="font-medium text-neutral-300">{post.author?.name || 'Anonymous'}</span>
                <span>•</span>
                <span>{post.author?.industry || 'General'}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <p class="text-neutral-400 leading-relaxed line-clamp-3">
            {post.content}
          </p>
        </div>
      {/each}
    </div>
  {/if}
</div>
