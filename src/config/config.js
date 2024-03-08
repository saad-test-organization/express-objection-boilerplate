import dotenv from 'dotenv';
import path from 'path'

const envPath= path.dirname(new URL(import.meta.url).pathname).replace("/src/config","/.env");
dotenv.config({path:envPath.replace('/','')});

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  saltRounds: process.env.SALTROUNDS,
  jwtExpirationAccess: process.env.JWT_EXPIRATION_ACCESS,
  jwtExpirationRefresh: process.env.JWT_EXPIRATION_REFRESH,
  rabbitMqUrl: process.env.RABBITMQ_URL,
  databaseConfig: {
    db_client: process.env.DB_CLIENT,
    db_host: process.env.DB_HOST,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_name: process.env.DB_NAME,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};

export default config;
