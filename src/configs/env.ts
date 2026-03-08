import { from } from "env-var";

const env = from(process.env);

// ─── Auth Database (Better Auth / pg Pool) ───────────────────────
export const authDatabaseConfig = {
  host: env.get("AUTH_DATABASE_HOST").default("localhost").asString(),
  port: env.get("AUTH_DATABASE_PORT").default("5432").asPortNumber(),
  database: env.get("AUTH_DATABASE_NAME").default("checkbill_auth").asString(),
  user: env.get("AUTH_DATABASE_USER").default("postgres").asString(),
  password: env.get("AUTH_DATABASE_PASSWORD").default("auth_password_here").asString(),
} as const;

// ─── Business Database (TypeORM) ─────────────────────────────────
export const businessDatabaseConfig = {
  host: env.get("BUSINESS_DATABASE_HOST").default("localhost").asString(),
  port: env.get("BUSINESS_DATABASE_PORT").default("5433").asPortNumber(),
  database: env.get("BUSINESS_DATABASE_NAME").default("checkbill_business").asString(),
  user: env.get("BUSINESS_DATABASE_USER").default("postgres").asString(),
  password: env.get("BUSINESS_DATABASE_PASSWORD").default("business_password_here").asString(),
} as const;

// ─── Google OAuth ────────────────────────────────────────────────
export const googleOAuthConfig = {
  clientId: env.get("GOOGLE_CLIENT_ID").required().asString(),
  clientSecret: env.get("GOOGLE_CLIENT_SECRET").required().asString(),
} as const;

// ─── Better Auth ─────────────────────────────────────────────────
export const betterAuthConfig = {
  secret: env.get("BETTER_AUTH_SECRET").required().asString(),
  url: env.get("BETTER_AUTH_URL").default("http://localhost:3000").asUrlString(),
} as const;

// ─── NextAuth ────────────────────────────────────────────────────
export const nextAuthConfig = {
  secret: env.get("NEXTAUTH_SECRET").required().asString(),
  url: env.get("NEXTAUTH_URL").default("http://localhost:3000").asUrlString(),
} as const;

// ─── General ─────────────────────────────────────────────────────
export const appConfig = {
  nodeEnv: env.get("NODE_ENV").default("development").asString(),
  isDev: env.get("NODE_ENV").default("development").asString() !== "production",
  publicBetterAuthUrl: env.get("NEXT_PUBLIC_BETTER_AUTH_URL").default("http://localhost:3000").asUrlString(),
} as const;
