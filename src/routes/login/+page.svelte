<script>
  // Import Supabase authentication client for user login functionality
  import { supabase } from '$lib/supabaseClient.js';
  // Import SvelteKit navigation utility for programmatic routing
  import { goto } from '$app/navigation';
  // Import global CSS styles for consistent application styling
  import '$lib/styles/global.css';

  // Reactive state variables for form input fields and error handling
  // These variables are bound to form inputs and update automatically
  let email = "";     // User's email address input
  let password = "";  // User's password input
  let error = "";     // Error message to display authentication failures

  /**
   * Handles user login authentication process
   * Prevents default form submission, authenticates with Supabase,
   * handles errors, and redirects on successful login
   * @param {Event} event - Form submission event to prevent default behavior
   */
  async function login(event) {
    // Prevent default form submission to handle authentication manually
    event?.preventDefault();

    // Attempt authentication using Supabase's password-based login
    // Destructure response to separate user data from potential errors
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // Handle authentication failure by displaying error message to user
    if (err) {
      // Format and display Supabase authentication error message
      error = "Supabase says: " + err.message;
      return; // Exit function early to prevent navigation
    }

    // Navigate to protected tasks page after successful authentication
    // This redirects the user to the main application interface
    goto('/tasks');
  }
</script>

<!-- Main authentication container with centered layout -->
<div class="auth-container">
  <!-- Authentication card containing the login form and branding -->
  <div class="auth-card">
    <!-- Header section with welcome message and branding -->
    <div class="auth-header">
      <h1>Welcome Back</h1>
      <p class="auth-subtitle">Sign in to your account</p>
    </div>
    
    <!-- Login form with email/password inputs and submission handling -->
    <form class="auth-form">
      <!-- Email input field with two-way data binding -->
      <div class="form-group">
        <input 
          bind:value={email} 
          type="email"
          placeholder="Email" 
          class="auth-input"
          required
        />
      </div>
      
      <!-- Password input field with two-way data binding -->
      <div class="form-group">
        <input 
          bind:value={password} 
          type="password" 
          placeholder="Password" 
          class="auth-input"
          required
        />
      </div>
      
      <!-- Submit button that triggers login function and prevents default form submission -->
      <button on:click|preventDefault={login} class="auth-btn primary">Sign In</button>
      
      <!-- Conditional error message display when authentication fails -->
      {#if error}
        <div class="auth-error">
          <!-- Clean up error message by removing Supabase prefix for better UX -->
          {error.replace('Supabase says: ', '')}
        </div>
      {/if}
    </form>
    
    <!-- Footer section with link to signup page for new users -->
    <div class="auth-footer">
      <p>Don't have an account? <button on:click={() => goto('/signup')} class="link-btn">Create Account</button></p>
    </div>
  </div>
</div>


