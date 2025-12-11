<script>
        import { supabase } from '$lib/supabaseClient';
        import { onMount } from 'svelte';
        import { goto } from '$app/navigation';
      
        onMount(async () => {
          const { data } = await supabase.auth.getSession();
          const session = data?.session;
      
          if (session) {
            goto("/tasks");   // User logged in → tasks
          } else {
            goto("/signup");   // Not logged in → signup
          }
        });
      </script>
      
      <p>Loading...</p>
      