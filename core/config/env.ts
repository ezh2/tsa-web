function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const publicEnv = {
  SUPABASE_URL: required("NEXT_PUBLIC_SUPABASE_URL"),
  SUPABASE_ANON_KEY: required("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
} as const;

export const serverEnv = {
  get SUPABASE_SERVICE_ROLE_KEY(): string {
    if (typeof window !== "undefined") {
      throw new Error("serverEnv must only be read from server code");
    }
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
} as const;
