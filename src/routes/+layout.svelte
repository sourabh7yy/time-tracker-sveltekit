<script>
  // Import Supabase client for authentication
  import { supabase } from "$lib/supabaseClient.js";
  import { goto } from '$app/navigation';
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
    goto('/login');
  }
</script>

<!-- Navigation bar displayed on all pages -->
<nav class="navbar">
  <!-- Brand/logo section -->
  <div class="nav-brand">
    <button on:click={() => goto('/tasks')} class="brand-btn">
      TimeTracker
    </button>
  </div>
  
  <!-- Main navigation links -->
  <div class="nav-center">
    <button on:click={() => goto('/tasks')} class="nav-btn">Tasks</button>
    <button on:click={() => goto('/summary')} class="nav-btn">Summary</button>
  </div>
  
  <!-- User authentication section -->
  <div class="nav-right">
    {#if user}
      <!-- Show user email and logout button when authenticated -->
      <span class="user-info">{user.email}</span>
      <button on:click={logout} class="logout-btn">
        Logout
      </button>
    {/if}
  </div>
</nav>

<!-- Render child page content -->
<slot />