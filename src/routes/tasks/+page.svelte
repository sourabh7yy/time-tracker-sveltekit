<script>
  import { supabase } from '$lib/supabaseClient.js';
  import { goto } from '$app/navigation';
  import '$lib/styles/global.css';

  // Component state
  let tasks = [];
  let loading = true;
  let error = "";

  // Fetch user's tasks from database
  async function loadTasks() {
    loading = true;

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      error = "Not logged in";
      loading = false;
      return;
    }

    const { data, error: err } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (err) {
      error = err.message;
      loading = false;
      return;
    }

    // Add a flag used for inline confirmation UI
    tasks = (data || []).map(t => ({ ...t, showConfirm: false }));
    loading = false;
  }

  // Format status for display
  function formatStatus(status) {
    switch(status) {
      case 'in_progress': return 'In Progress';
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      default: return status;
    }
  }

  // Load tasks on component mount
  loadTasks();
</script>

<div class="container">
  <div class="tasks-header">
    <h1>Your Tasks</h1>
    <p class="subtitle">Manage and track your tasks</p>
  </div>
  
  <div class="tasks-actions">
    <button on:click={() => goto('/tasks/new')} class="create-task-btn">Create New Task</button>
  </div>
  
  <div class="tasks-content">
    {#if loading}
      <div class="loading-state">
        <p>Loading tasks...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <p>{error}</p>
      </div>
    {:else if tasks.length === 0}
      <div class="empty-state">
        <p>No tasks yet. Create your first task to get started!</p>
      </div>
    {:else}
      <div class="tasks-grid">
        {#each tasks as task}
          <div class="task-card">
            <div class="task-card-header">
              <div class="task-info">
                <h3 class="task-card-title">{task.title}</h3>
                {#if task.description}
                  <p class="task-description">{task.description.length > 80 ? task.description.substring(0, 80) + '...' : task.description}</p>
                {/if}
              </div>
              <span class="task-card-status status-{task.status}">{formatStatus(task.status)}</span>
            </div>
            
            <div class="task-card-actions">
              <button on:click={() => goto(`/tasks/${task.id}`)} class="task-action-btn primary">Open</button>
              <button on:click={() => goto(`/tasks/${task.id}/edit`)} class="task-action-btn secondary">Edit</button>
              
              {#if task.showConfirm}
                <div class="delete-confirmation">
                  <p>Delete <strong>{task.title}</strong>?</p>
                  <div class="confirm-actions">
                    <button on:click={() => task.showConfirm = false} class="cancel-btn">Cancel</button>
                    <button
                      on:click={async () => {
                        await supabase.from("tasks").delete().eq("id", task.id);
                        loadTasks();
                      }}
                      class="confirm-delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              {:else}
                <button class="task-action-btn danger" on:click={() => task.showConfirm = true}>
                  Delete
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>


