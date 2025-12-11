<script>
  import { supabase } from '$lib/supabaseClient.js';
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

<div class="container">
  <h1>Create Account</h1>
  <p class="subtitle">Sign up for a new account</p>
  
  <form on:submit={signup}>
    <input 
      bind:value={email} 
      type="email" 
      placeholder="Email" 
      required 
      disabled={loading}
    />
    <input 
      bind:value={password} 
      type="password" 
      placeholder="Password" 
      required 
      disabled={loading}
    />
    
    <button type="submit" disabled={loading} class="btn-full">
      {loading ? 'Creating Account...' : 'Create Account'}
    </button>
  </form>
  
  {#if error}
    <p style="color:red">{error}</p>
  {/if}
  {#if message}
    <p style="color:green; margin-top: 15px; padding: 10px; background: #d4edda; border-radius: 4px;">{message}</p>
  {/if}
  
  <p style="text-align: center; margin-top: 20px; color: #666;">
    Already have an account? <a href="/login" style="color: #007cba;">Sign in</a>
  </p>
</div>
