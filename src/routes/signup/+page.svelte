<script>
import { supabase } from '$lib/supabaseClient.js';

  // Form state: user-entered email/password and feedback messages
  let email = '';
  let password = '';
  let message = '';
  let error = '';

  // Call Supabase signUp; show success or error feedback based on result
  async function signup() {
    message = '';
    error = '';

    const { error: err } = await supabase.auth.signUp({ email, password });

    if (err) {
      error = err.message;
    } else {
      message = 'Account created! Now you can login.';
    }
  }
</script>

<h1>Sign Up</h1>

<input bind:value={email} placeholder="Email" />
<input bind:value={password} type="password" placeholder="Password" />

<button on:click={signup}>Create Account</button>

{#if error}<p style="color:red">{error}</p>{/if}
{#if message}<p style="color:green">{message}</p>{/if}
