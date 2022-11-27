import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const dbPassword = `${process.env.REACT_APP_DB_PASSWORD}`;
const dbUser = `${process.env.REACT_APP_DB_USER}`;
const dbDataBase = `${process.env.REACT_APP_DB_DATABASE}`;
const dbPort = `${process.env.REACT_APP_DB_PORT}`;
const host = `${process.env.REACT_APP_HOST}`;

const client = new Pool({
  user: dbUser,
  host: host,
  database: dbDataBase,
  password: dbPassword,
  port: dbPort,
});

export default client;
