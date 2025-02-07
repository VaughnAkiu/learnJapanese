import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../server.js';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    console.log('userWordsGet attempted to run...');
    // todo: add filter for user_id to query
    const userTable = process.env.DB_USER_TABLE;
    console.log('user table output test:', userTable);
    const queryData =  await pool.query('SELECT id FROM ' + userTable);
    response.status(200).json(queryData);
  } catch (error) {
    response.status(500).json({ message: 'failed to load data', error: error.message })
  }
};