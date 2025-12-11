<script>
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  // Sign out via Supabase then return user to the login page
  async function logout() {
    await supabase.auth.signOut();
    goto('/login');
  }
</script>

<button on:click={logout}>Logout</button>
