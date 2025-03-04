import type { Knex } from "knex";
import * as dotenv from "dotenv";
dotenv.config();

const config: Knex.Config = {
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    },
    migrations: {
        directory: "./migrations",
        tableName: "knex_migrations"
    }
};
export default config;
