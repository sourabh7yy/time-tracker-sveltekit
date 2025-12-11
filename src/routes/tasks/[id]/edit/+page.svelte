<script>
  // Import SvelteKit stores and Supabase client
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabaseClient.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // Component state variables
  let task = null;      // Current task data
  let loading = true;   // Loading state for initial fetch
  let saving = false;   // Saving state for updates
  let error = "";       // Error message display
  let successMessage = ""; // Success message display
  let showDeleteConfirm = false; // Delete confirmation dialog

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

    // Show success message
    successMessage = "Task updated successfully!";
    setTimeout(() => {
      successMessage = "";
    }, 2000);
  }

  // Delete task with confirmation
  async function deleteTask() {
    // Remove task from database
    await supabase.from("tasks").delete().eq("id", id);
    goto('/tasks');
  }

  // Load task data when component mounts
  onMount(loadTask);
</script>

<div class="container">
  {#if loading}
    <div class="loading-state">
      <p>Loading task...</p>
    </div>
  {:else if error}
    <div class="error-state">
      <p>{error}</p>
    </div>
  {:else}
    <button on:click={() => goto('/tasks')} class="back-link">Back to Tasks</button>
    
    <div class="edit-task-header">
      <h1>Edit Task</h1>
      <p class="subtitle">Update task details and status</p>
    </div>
    
    {#if successMessage}
      <div class="success-message">
        {successMessage}
      </div>
    {/if}

    <div class="edit-form">
      <div class="form-section">
        <div class="form-group">
          <label>Task Title *</label>
          <input 
            bind:value={task.title} 
            placeholder="Enter task title"
            class="title-input"
          />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea 
            bind:value={task.description}
            placeholder="Add task details (optional)"
            class="description-input"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Status</label>
          <select bind:value={task.status} class="status-select">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button on:click={saveTask} disabled={saving || !task.title?.trim()} class="save-btn">
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      
      {#if showDeleteConfirm}
        <div class="delete-confirmation-dialog">
          <p>Delete <strong>{task.title}</strong>?</p>
          <div class="confirm-actions">
            <button on:click={() => showDeleteConfirm = false} class="cancel-btn">Cancel</button>
            <button on:click={deleteTask} class="confirm-delete-btn">Delete</button>
          </div>
        </div>
      {:else}
        <button on:click={() => showDeleteConfirm = true} class="delete-btn">
          Delete Task
        </button>
      {/if}
    </div>
  {/if}
</div>
