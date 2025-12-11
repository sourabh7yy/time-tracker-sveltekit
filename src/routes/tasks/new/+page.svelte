<script>
  import { supabase } from '$lib/supabaseClient.js';
  import '$lib/styles/global.css';

  let userInput = "";
  let title = "";
  let description = "";
  let loading = false;
  let error = "";

  // Fake AI logic (simple smart rewording)
 async function generateAI() {
  if (!userInput.trim()) {
    error = "Please describe your task first.";
    return;
  }

  error = "";
  loading = true;

  try {
    const response = await fetch("/api/ai-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userInput })
    });

    const data = await response.json();

    if (data.error) {
      error = data.error;
    } else {
      title = data.title;
      description = data.description;
    }
  } catch (e) {
    error = "AI request failed.";
  }

  loading = false;
}


  async function createTask() {
    error = "";
    loading = true;

    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (!user) {
      error = "Not logged in.";
      loading = false;
      return;
    }

    if (!title.trim()) {
      error = "Title cannot be empty.";
      loading = false;
      return;
    }

    const { error: insertError } = await supabase.from("tasks").insert({
      title,
      description,
      status: "pending",
      user_id: user.id
    });

    loading = false;

    if (insertError) {
      error = insertError.message;
      return;
    }

    window.location.href = "/tasks";
  }
</script>

<div class="container">
  <h1>Create Task</h1>
  
  <label>Describe your task:</label>
  <textarea bind:value={userInput} placeholder="e.g., follow up with designer"></textarea>
  
  <button on:click={generateAI} class="ai-btn" disabled={loading}>
    {loading ? 'Generating...' : '🤖 Generate with AI'}
  </button>
  
  <hr />
  
  <label>Task Title</label>
  <input bind:value={title} placeholder="Generated or manual title" disabled={loading} />
  
  <label>Description</label>
  <textarea bind:value={description} placeholder="Generated or manual description" disabled={loading}></textarea>
  
  <button on:click={createTask} disabled={loading} class="btn-full">
    {loading ? 'Saving...' : 'Save Task'}
  </button>
  
  {#if error}
    <p style="color:red">{error}</p>
  {/if}
</div>
