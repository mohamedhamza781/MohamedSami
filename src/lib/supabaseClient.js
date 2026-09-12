import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in dev rather than silently falling back — a missing env
  // var here means content/login/uploads would all quietly stop working.
  // eslint-disable-next-line no-console
  console.error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your project's values."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Name of the row in `site_content` that stores the whole site's content
// (see the SQL setup script — one row, id = 1, one jsonb column).
export const CONTENT_ROW_ID = 1;

// Name of the public Storage bucket used for uploaded photos/video.
export const MEDIA_BUCKET = "media";