<script>
  import { supabase } from '$lib/supabaseClient.js';
  import { goto } from '$app/navigation';
  import '$lib/styles/global.css';

  // Form state: user-entered email/password and feedback messages
  let email = '';
  let password = '';
  let message = '';
  let error = '';
  let loading = false;

  // Call Supabase signUp; show success or error feedback based on result
  async function signup(event) {
    event?.preventDefault();
    loading = true;
    message = '';
    error = '';

    const { error: err } = await supabase.auth.signUp({ email, password });

    loading = false;

    if (err) {
      error = err.message;
    } else {
      message = 'Account created! Now you can login.';
    }
  }
</script>

<div class="auth-container">
  <div class="auth-card">
    <div class="auth-header">
      <h1>Create Account</h1>
    </div>
    
    <form class="auth-form" on:submit={signup}>
      <div class="form-group">
        <input 
          bind:value={email} 
          type="email" 
          placeholder="Email" 
          class="auth-input"
          required 
          disabled={loading}
        />
      </div>
      
      <div class="form-group">
        <input 
          bind:value={password} 
          type="password" 
          placeholder="Password" 
          class="auth-input"
          required 
          disabled={loading}
        />
      </div>
      
      <button type="submit" disabled={loading} class="auth-btn primary">
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
      
      {#if error}
        <div class="auth-error">
          {error}
        </div>
      {/if}
      
      {#if message}
        <div class="auth-success">
          {message}
        </div>
      {/if}
    </form>
    
    <div class="auth-footer">
      <p>Already have an account? <button on:click={() => goto('/login')} class="link-btn">Sign In</button></p>
    </div>
  </div>
</div>
