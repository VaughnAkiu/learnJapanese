import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../dbconnection';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    console.log('userWordsGet attempted to run...');

    let queryString = 'SELECT * FROM public.user_words ';

    if(request.headers["user_id"]) {
      queryString += ' WHERE user_id = ' + request.headers["user_id"].toString() + ';';
    }

    const queryData =  await pool.query(queryString);
    response.status(200).json(queryData);
  } catch (error) {
    response.status(500).json({ message: 'failed to load data', error: error.message })
  }
};