// Supabase functionality has been bypassed/mocked so the application runs locally and standalone
// without requiring any Supabase credentials or backend infrastructure.
import { analyzeCoralHealth } from "@/services/coralService";

export const supabase = {
  functions: {
    invoke: async (functionName: string, options?: { body?: any }) => {
      console.log(`[Supabase Mock] functions.invoke('${functionName}') called`);
      if (functionName === "analyze-coral-health" && options?.body instanceof FormData) {
        const file = options.body.get("file") as File;
        if (file) {
          const result = await analyzeCoralHealth(file);
          return { data: result, error: null };
        }
      }
      return { data: null, error: null };
    },
  },
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    signInWithPassword: async () => ({ data: {}, error: null }),
    signUp: async () => ({ data: {}, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: (_table: string) => ({
    select: () => ({
      data: [],
      error: null,
      order: () => ({ data: [], error: null }),
      eq: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
    }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
  }),
  storage: {
    from: (_bucket: string) => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: (_path: string) => ({ data: { publicUrl: "" } }),
    }),
  },
} as any;