import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../dbconnection';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    console.log('userGet attempted to run...');

    const userTable = process.env.NEXT_PUBLIC_DB_USER_TABLE;
    let queryString = 'SELECT id FROM ' + userTable;

    if(request.headers["github_id"]) {
      queryString += ' WHERE github_id = ' + request.headers["github_id"].toString() + ';';
    }
    console.log('userGet queryString:', queryString);
    // console.log('user table output test:', userTable);
    const queryData =  await pool.query(queryString);

    response.status(200).json(queryData);
  } catch (error) {
    response.status(500).json({ message: 'failed to load data', error: error.message })
  }
};