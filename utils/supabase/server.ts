// utils/supabase/server.ts
// Minimal Supabase client stub used when a real implementation is not provided.
type SupabaseQueryResult<T> = Promise<{ data: T | null; error: null }>;

type SupabaseQueryFilter<T> = {
  eq: (...args: unknown[]) => SupabaseQueryResult<T>;
};

type SupabaseQueryBuilder<T> = {
  select: (...args: unknown[]) => SupabaseQueryFilter<T>;
};

class SupabaseClientStub {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  from<T>(_table: string): SupabaseQueryBuilder<T> {
    return {
      select: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
    };
  }
}

let hasWarned = false;

export async function getServerSupabase() {
  if (!hasWarned) {
    console.info(
      "Supabase server stub loaded; returning empty results for all queries."
    );
    hasWarned = true;
  }

  return new SupabaseClientStub();
}
