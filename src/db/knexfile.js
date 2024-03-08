import { knexSnakeCaseMappers } from 'objection';
import config from "../config/config.js"

export default {
  client: 'pg',
  connection: {
    host: config.databaseConfig.db_host,
    user: config.databaseConfig.db_user,
    password: config.databaseConfig.db_password,
    database: config.databaseConfig.db_name
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './seeds',
  },
  // automatically convert camelCase to snake case
  // so table names are in snake case
  // but we can use camelCase fields per default
  ...knexSnakeCaseMappers(),
};