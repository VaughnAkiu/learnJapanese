// handles database connections

//connection pool
//manage and reuse db connections

//load environment variables from  dotenv package into app

// So the basic format for connecting to a remote database typically looks something like this:
// psql -h <hostname> -p <port> -U <username> -d <database>

import pg from 'pg'
const { Pool, Client } = pg
// const connectionString = 'postgresql://postgres:23qwD$$@localhost:5432/kanji'
// pg.defaults.ssl = false;
 
// const pool = new Pool({
//   connectionString,
//   ssl: false,
// });

console.log('environment variables: ', process.env.DB_USER );
 
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  // idleTimeoutMillis: 0,
  // connectionTimeoutMillis: 0,
  // acquireConnectionTimeout: 5000,
  // min: 0,
  // max: 10,
  // createTimeoutMillis: 8000,
  // acquireTimeoutMillis: 8000,
  // idleTimeoutMillis: 8000,
  // reapIntervalMillis: 1000,
  // createRetryIntervalMillis: 100,
  ssl: false
});

// console.log(await pool.query('SELECT NOW()'))
 
export default pool;

// await client.connect()
 
// console.log(await client.query('SELECT NOW()'))
 
// await client.end()