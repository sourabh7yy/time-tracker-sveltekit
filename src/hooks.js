import { supabase } from '$lib/supabaseClient.js';

// Client-side hook: populate locals.session from Supabase for SPA navigation
export async function handle({ event, resolve }) {
  const { data } = await supabase.auth.getSession();
  event.locals.session = data.session;

  return resolve(event);
}
