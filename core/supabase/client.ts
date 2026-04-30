import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/core/config/env";

export function createClient() {
  return createBrowserClient(
    publicEnv.SUPABASE_URL,
    publicEnv.SUPABASE_ANON_KEY,
  );
}
