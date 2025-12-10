<script>
import { supabase } from '$lib/supabaseClient.js';

  // Form state and user-facing error copy
  let title = '';
  let error = '';

  // Insert a new task for the logged-in user; redirect back to list on success
  async function createTask() {
    error = '';

    // Resolve the current session to attribute the task to the user
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      error = 'Not logged in';
      return;
    }

    const { error: insertError } = await supabase.from('tasks').insert({
      title,
      description: '',
      status: 'pending',
      user_id: user.id
    });

    if (insertError) {
      error = insertError.message;
      return;
    }

    window.location.href = '/tasks';
  }
</script>

<h1>Create Task</h1>

<input placeholder="Task title" bind:value={title} />

<button on:click={createTask}>Save Task</button>

{#if error}<p style="color:red">{error}</p>{/if}
