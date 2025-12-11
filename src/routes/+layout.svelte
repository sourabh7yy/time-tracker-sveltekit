<script>
  // Import Supabase client for authentication
  import { supabase } from "$lib/supabaseClient.js";
  import { onMount } from "svelte";
  import '$lib/styles/global.css';

  // Store current authenticated user
  let user = null;

  // Initialize authentication state on component mount
  onMount(async () => {
    // Get current session from Supabase
    const { data } = await supabase.auth.getSession();
    user = data?.session?.user || null;

    // Listen for authentication state changes (login/logout)
    supabase.auth.onAuthStateChange((_event, session) => {
      user = session?.user || null;
    });
  });

  // Handle user logout
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }
</script>

<nav>
  <div class="nav-links">
    <a href="/tasks">📋 Tasks</a>
    <a href="/summary">📊 Summary</a>
  </div>
  
  {#if user}
    <button on:click={logout} class="logout-btn">
      Logout
    </button>
  {/if}
</nav>

<!-- Render child page content -->
<slot />
