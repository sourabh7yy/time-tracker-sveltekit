<script>
  // Import Supabase client for authentication
  import { supabase } from "$lib/supabaseClient.js";
  import { onMount } from "svelte";

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

<!-- Main navigation bar -->
<nav style="padding:12px; border-bottom:1px solid #ddd; display:flex; justify-content:space-between;">
  <!-- Navigation links -->
  <div>
    <a href="/tasks" style="margin-right:12px;">Tasks</a>
    <a href="/summary" style="margin-right:12px;">Summary</a>
  </div>

  <!-- Show logout button only when user is authenticated -->
  {#if user}
    <button on:click={logout} style="background:red; color:white; padding:5px 10px;">
      Logout
    </button>
  {/if}
</nav>

<!-- Render child page content -->
<slot />
