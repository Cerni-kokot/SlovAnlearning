/* Copy to dist/config.js. These two values are PUBLIC and protected by database RLS.
   NEVER use a service-role, Supabase secret key or OpenAI API key in this file. */
window.ATLAS_CONFIG = {
  SUPABASE_URL: '',              // e.g. https://your-project.supabase.co
  SUPABASE_ANON_KEY: ''          // Supabase legacy anon key or public publishable key
};
