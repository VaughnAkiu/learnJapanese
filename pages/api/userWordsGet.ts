import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../server.js';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    console.log('userWordsGet attempted to run...');
    const queryData =  await pool.query('SELECT * FROM public.user_words');
    response.status(200).json(queryData);
  } catch (error) {
    response.status(500).json({ message: 'failed to load data', error: error.message })
  }
};