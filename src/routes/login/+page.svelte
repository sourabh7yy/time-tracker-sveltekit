<script>

  import { supabase } from '$lib/supabaseClient.js';

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
    window.location.href = "/tasks";
  }
</script>

<h1>Login</h1>

<input bind:value={email} placeholder="Email" />
<input bind:value={password} type="password" />

<button on:click|preventDefault={login}>Login</button>

{#if error}
  <p style="color:red">{error}</p>
{/if}
