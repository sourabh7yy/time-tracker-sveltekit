import { supabase } from '$lib/supabaseClient.js';
import { redirect } from '@sveltejs/kit';

// run this layout only in the browser (so supabase client can read session)
export const ssr = false;

export async function load() {
  // Fetch the current auth session via the Supabase client; redirect if missing
  const { data } = await supabase.auth.getSession();

  if (!data?.session) {
    throw redirect(303, '/login');
  }

  // Expose the session to the page for downstream requests/components
  return {
    session: data.session
  };
}
