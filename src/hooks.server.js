// Server hook: placeholder locals.session so SSR paths don't crash
export async function handle({ event, resolve }) {
  event.locals.session = null;
  return resolve(event);
}
