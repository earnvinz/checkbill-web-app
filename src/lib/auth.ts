import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { authDatabaseConfig } from "@/configs";

export const auth = betterAuth({
  database: new Pool({
    host: authDatabaseConfig.host,
    port: authDatabaseConfig.port,
    database: authDatabaseConfig.database,
    user: authDatabaseConfig.user,
    password: authDatabaseConfig.password,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
