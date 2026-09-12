import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface QueryState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  /** true when `data` came from Supabase rather than the mock fallback. */
  live: boolean;
}

/**
 * Runs `fetcher(supabase)` against the live Supabase client and returns its
 * result, falling back to `mockData` (synchronously, no loading flicker) if
 * Supabase isn't configured (see src/lib/supabaseClient.ts). On a Supabase
 * error, also falls back to `mockData` so the UI never breaks mid-demo.
 */
export function useSupabaseQuery<T>(
  fetcher: (client: NonNullable<typeof supabase>) => Promise<T>,
  mockData: T,
  deps: React.DependencyList = [],
): QueryState<T> {
  const [state, setState] = useState<QueryState<T>>(
    supabase ? { data: mockData, loading: true, error: null, live: false } : { data: mockData, loading: false, error: null, live: false },
  );
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    setState(s => ({ ...s, loading: true }));

    fetcher(supabase)
      .then(data => {
        if (cancelled) return;
        setState({ data, loading: false, error: null, live: true });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        setState({ data: mockData, loading: false, error: message, live: false });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
