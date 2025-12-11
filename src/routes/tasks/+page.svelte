<script>
  import { supabase } from '$lib/supabaseClient.js';

  let tasks = [];
  let loading = true;
  let error = "";

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

  loadTasks();
</script>

<h1>Your Tasks</h1>

<a href="/tasks/new">➕ Create New Task</a>

{#if loading}
  <p>Loading tasks...</p>
{:else if error}
  <p style="color:red">{error}</p>
{:else if tasks.length === 0}
  <p>No tasks yet. Create one!</p>
{:else}
  <ul>
    {#each tasks as task}
      <li style="margin-bottom:12px;">
       <strong>{task.title}</strong> — {task.status}

<!-- NEW: Open Task Detail Page -->
<a href={`/tasks/${task.id}`} style="margin-left: 10px;">
  Open
</a>

<!-- Edit Page -->
<a href={`/tasks/${task.id}/edit`} style="margin-left: 10px;">
  Edit
</a>


        <!-- DELETE CONFIRMATION UI -->
        {#if task.showConfirm}
          <div style="
            margin-top:8px; 
            padding:10px; 
            border:1px solid red; 
            background:#ffe6e6;
            border-radius:6px;
            width: fit-content;
          ">
            <p>Delete <strong>{task.title}</strong>?</p>

            <button on:click={() => task.showConfirm = false}>
              Cancel
            </button>

            <button
              on:click={async () => {
                await supabase.from("tasks").delete().eq("id", task.id);
                loadTasks();
              }}
              style="color:white; background:red; margin-left:10px; padding:4px 8px;"
            >
              Delete
            </button>
          </div>
        {:else}
          <!-- Delete button triggers inline dialog -->
          <button
            style="color:red; margin-left: 10px;"
            on:click={() => task.showConfirm = true}
          >
            Delete
          </button>
        {/if}
      </li>
    {/each}
  </ul>
{/if}
