import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";
import { from } from "env-var";

// Load .env for CLI usage (outside of Next.js)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const env = from(process.env);

const BusinessDataSource = new DataSource({
  type: "postgres",
  host: env.get("BUSINESS_DATABASE_HOST").default("localhost").asString(),
  port: env.get("BUSINESS_DATABASE_PORT").default("5433").asPortNumber(),
  database: env.get("BUSINESS_DATABASE_NAME").default("checkbill_business").asString(),
  username: env.get("BUSINESS_DATABASE_USER").default("postgres").asString(),
  password: env.get("BUSINESS_DATABASE_PASSWORD").default("business_password_here").asString(),
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, "entities", "**", "*.{ts,js}")],
  migrations: [path.join(__dirname, "migrations", "**", "*.{ts,js}")],
});

export default BusinessDataSource;
