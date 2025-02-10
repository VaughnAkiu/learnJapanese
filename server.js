

import pg from 'pg'
const { Pool, Client } = pg


//local db
// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,

//   ssl: false
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

 
export default pool;

