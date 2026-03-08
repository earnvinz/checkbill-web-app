import "reflect-metadata";
import { DataSource } from "typeorm";
import { businessDatabaseConfig, appConfig } from "@/configs";

export const BusinessDataSource = new DataSource({
  type: "postgres",
  host: businessDatabaseConfig.host,
  port: businessDatabaseConfig.port,
  database: businessDatabaseConfig.database,
  username: businessDatabaseConfig.user,
  password: businessDatabaseConfig.password,
  synchronize: appConfig.isDev,
  logging: appConfig.isDev,
  entities: [__dirname + "/entities/**/*.{ts,js}"],
  migrations: [__dirname + "/migrations/**/*.{ts,js}"],
});
