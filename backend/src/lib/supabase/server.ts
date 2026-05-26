import env from "@/utils/env";
import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient() {
    return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}
