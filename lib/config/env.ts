export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
};
//lib/config/env.ts
export function requireEnv(name: keyof typeof env) {
  const v = env[name];
  if (!v) {
    throw new Error(`Missing env: ${name} (check .env.local)`);
  }
  return v;
}