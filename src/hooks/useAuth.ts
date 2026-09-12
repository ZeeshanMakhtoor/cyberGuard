import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

/**
 * Tracks the current Supabase Auth session. When Supabase isn't configured
 * (see supabaseClient.ts), `session` stays `null` and `ready` is
 * immediately `true` with `authRequired: false` — App.tsx uses that to skip
 * the login gate entirely so the demo still works with zero setup.
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!supabase);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, ready, authRequired: Boolean(supabase) };
}
