import "server-only";
import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/core/config/env";

// Service-role client for the Stripe webhook ONLY. It bypasses RLS, so it must
// never be used in a user-facing request path (CLAUDE.md §7). The webhook is a
// trusted server-to-server path authenticated by Stripe's signature.
export function createAdminClient(): SupabaseClient {
  return createSupabaseClient(
    publicEnv.SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
