<script>
  import { supabase } from '$lib/supabaseClient.js';
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

  // Load tasks on component mount
  loadTasks();
</script>

<div class="container">
  <h1>Your Tasks</h1>
  
  <a href="/tasks/new" class="create-btn">➕ Create New Task</a>
  
  {#if loading}
    <p>Loading tasks...</p>
  {:else if error}
    <p style="color:red">{error}</p>
  {:else if tasks.length === 0}
    <p>No tasks yet. Create one!</p>
  {:else}
    <ul>
      {#each tasks as task}
        <li class="task-item">
         <strong>{task.title}</strong> — {task.status}
  
          <a href={`/tasks/${task.id}`} class="action-btn">Open</a>
          <a href={`/tasks/${task.id}/edit`} class="action-btn">Edit</a>
  
          {#if task.showConfirm}
            <!-- Confirmation dialog for task deletion -->
            <div class="confirm-dialog">
              <p>Delete <strong>{task.title}</strong>?</p>
              <button on:click={() => task.showConfirm = false}>Cancel</button>
              <button
                on:click={async () => {
                  await supabase.from("tasks").delete().eq("id", task.id);
                  loadTasks();
                }}
                class="delete-confirm"
              >
                Delete
              </button>
            </div>
          {:else}
            <button class="delete-btn" on:click={() => task.showConfirm = true}>
              Delete
            </button>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>


