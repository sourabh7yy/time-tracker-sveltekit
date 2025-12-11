<script>
  import { supabase } from '$lib/supabaseClient.js';
  import { goto } from '$app/navigation';
  import '$lib/styles/global.css';

  // Local state for the form fields and user-facing error copy
  let email = "";
  let password = "";
  let error = "";

  // Attempt a password-based login with Supabase and route to /tasks on success
  async function login(event) {
    event?.preventDefault();

    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password
    });


    if (err) {
      // Surface Supabase error to the user if authentication fails
      error = "Supabase says: " + err.message;
      return;
    }

    // Send the user to the protected tasks area after a successful login
    goto('/tasks');
  }
</script>

<div class="auth-container">
  <div class="auth-card">
    <div class="auth-header">
      <h1>Welcome Back</h1>
      <p class="auth-subtitle">Sign in to your account</p>
    </div>
    
    <form class="auth-form">
      <div class="form-group">
        <input 
          bind:value={email} 
          type="email"
          placeholder="Email" 
          class="auth-input"
          required
        />
      </div>
      
      <div class="form-group">
        <input 
          bind:value={password} 
          type="password" 
          placeholder="Password" 
          class="auth-input"
          required
        />
      </div>
      
      <button on:click|preventDefault={login} class="auth-btn primary">Sign In</button>
      
      {#if error}
        <div class="auth-error">
          {error.replace('Supabase says: ', '')}
        </div>
      {/if}
    </form>
    
    <div class="auth-footer">
      <p>Don't have an account? <button on:click={() => goto('/signup')} class="link-btn">Create Account</button></p>
    </div>
  </div>
</div>


