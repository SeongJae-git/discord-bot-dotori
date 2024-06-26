import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const mariaDBConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
};

export { mariaDBConfig };
