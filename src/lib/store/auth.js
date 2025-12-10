import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

// Writable store that mirrors the current Supabase auth user (or null)
export const user = writable(null);

// Load initial session on client hydration and push user into the store
(async () => {
  const { data } = await supabase.auth.getSession();
  user.set(data?.session?.user ?? null);
})();

// React to auth state changes (login/logout/token refresh) and update store
supabase.auth.onAuthStateChange((_event, session) => {
  user.set(session?.user ?? null);
});
