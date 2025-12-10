<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient.js';

  // Local state: fetched tasks and a simple loading flag
  let tasks = [];
  let loading = true;

  // Pull tasks for the current user and order newest-first
  async function loadTasks() {
    loading = true;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) tasks = data || [];

    loading = false;
  }

  // Kick off fetch when the page mounts in the browser
  onMount(loadTasks);
</script>

<h1>Your Tasks</h1>

<a href="/tasks/new">+ Create Task</a>

{#if loading}
  <p>Loading tasks...</p>
{:else if tasks.length === 0}
  <p>No tasks yet.</p>
{:else}
  {#each tasks as task}
    <div style="border:1px solid #ddd; padding:8px; margin:5px 0;">
      <a href={`/tasks/${task.id}`}>{task.title}</a>
      <p>Status: {task.status}</p>
    </div>
  {/each}
{/if}
