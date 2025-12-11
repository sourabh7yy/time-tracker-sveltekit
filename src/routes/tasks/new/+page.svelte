<script>
  import { supabase } from '$lib/supabaseClient.js';
  import { goto } from '$app/navigation';
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

    goto('/tasks');
  }
</script>

<div class="container">
  <button on:click={() => goto('/tasks')} class="back-link">Back to Tasks</button>
  
  <div class="create-task-header">
    <h1>Create New Task</h1>
  </div>
  
  <div class="form-section">
    <div class="ai-section">
      <h3>AI Assistant</h3>
      <label>Describe what you need to do:</label>
      <textarea 
        bind:value={userInput} 
        placeholder="e.g., follow up with designer about the new logo"
        class="ai-input"
      ></textarea>
      
      <button on:click={generateAI} class="ai-btn" disabled={loading}>
        {loading ? 'Generating...' : 'Generate with AI'}
      </button>
    </div>
    
    <div class="divider">
      <span>OR</span>
    </div>
    
    <div class="manual-section">
      <h3>Manual Entry</h3>
      
      <div class="form-group">
        <label>Task Title *</label>
        <input 
          bind:value={title} 
          placeholder="Enter task title" 
          disabled={loading}
          class="title-input"
        />
      </div>
      
      <div class="form-group">
        <label>Description</label>
        <textarea 
          bind:value={description} 
          placeholder="Add task details (optional)"
          disabled={loading}
          class="description-input"
        ></textarea>
      </div>
    </div>
  </div>
  
  <div class="form-actions">
    <button on:click={createTask} disabled={loading || !title.trim()} class="create-btn-primary">
      {loading ? 'Creating Task...' : 'Create Task'}
    </button>
  </div>
  
  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}
</div>
