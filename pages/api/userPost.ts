import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../dbconnection';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    console.log('userWordsPost attempted to run...');
    const userTable = process.env.DB_USER_TABLE;

    const headerInsert : string = request.headers["insert"].toString();

    let insertString = 'INSERT INTO ' + userTable + ' (user_name) VALUES';

    const queryData =  await pool.query(insertString);

    response.status(200).json(queryData);
  } catch (error) {
    response.status(500).json({ message: 'failed to load data', error: error.message })
  }
};