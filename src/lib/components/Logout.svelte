<script>
  import { supabase } from '$lib/supabaseClient';

  // Sign out via Supabase then return user to the login page
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }
</script>

<button on:click={logout}>Logout</button>
