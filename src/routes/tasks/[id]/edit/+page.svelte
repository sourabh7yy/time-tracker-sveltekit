<script>
  // Import SvelteKit stores and Supabase client
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabaseClient.js';
  import { onMount } from 'svelte';

  // Component state variables
  let task = null;      // Current task data
  let loading = true;   // Loading state for initial fetch
  let saving = false;   // Saving state for updates
  let error = "";       // Error message display

  // Extract task ID from URL parameters
  $: id = $page.params.id;

  // Load task data from database
  async function loadTask() {
    loading = true;

    // Verify user authentication
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      error = "Not logged in.";
      loading = false;
      return;
    }

    // Fetch task by ID, ensuring user owns the task
    const { data, error: err } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (err) {
      error = err.message;
    } else {
      task = data;
    }

    loading = false;
  }

  // Save task changes to database
  async function saveTask() {
    saving = true;

    // Update task with current form values
    const { error: err } = await supabase
      .from("tasks")
      .update({
        title: task.title,
        description: task.description,
        status: task.status
      })
      .eq("id", id);

    saving = false;

    if (err) {
      error = err.message;
      return;
    }

    // Redirect to tasks list on success
    alert("Task updated!");
    window.location.href = "/tasks";
  }

  // Delete task with confirmation
  async function deleteTask() {
    if (!confirm("Delete this task?")) return;

    // Remove task from database
    await supabase.from("tasks").delete().eq("id", id);
    window.location.href = "/tasks";
  }

  // Load task data when component mounts
  onMount(loadTask);
</script>

<!-- Conditional rendering based on loading/error states -->
{#if loading}
  <p>Loading task...</p>
{:else if error}
  <p style="color:red">{error}</p>
{:else}
  <h1>Edit Task</h1>

  <!-- Task form fields -->
  <label>Title</label>
  <input bind:value={task.title} />

  <label>Description</label>
  <textarea bind:value={task.description}></textarea>

  <label>Status</label>
  <select bind:value={task.status}>
    <option value="pending">Pending</option>
    <option value="in_progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>

  <!-- Action buttons -->
  <button on:click={saveTask} disabled={saving} style="margin-top:12px;">
    {#if saving}Saving...{/if}
    {#if !saving}Save Changes{/if}
  </button>

  <button 
    on:click={deleteTask} 
    style="color:white; background:red; margin-top:16px; padding:6px 12px; border:none;">
    Delete Task
  </button>
{/if}
