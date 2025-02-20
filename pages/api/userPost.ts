import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../dbconnection';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    console.log('userWordsPost attempted to run...');
    const userTable = process.env.NEXT_PUBLIC_DB_USER_TABLE;

    let insertString = 'INSERT INTO ' + userTable;
    if(request.headers["github_id"]) {

      insertString += ' (github_id) VALUES (' + request.headers["github_id"].toString() + ') RETURNING id;';

      const queryData =  await pool.query(insertString);

      response.status(200).json(queryData);

    } else {

      response.status(500).json({message: 'No data to post.'});
      throw Error('No data to post.');
    }

  } catch (error) {
    response.status(500).json({ message: 'failed to load data', error: error.message })
  }
};