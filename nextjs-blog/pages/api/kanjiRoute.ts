import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../server.js';
// import kanjiData from '/kanji';
// import kanjiData from '../public/data/kanji.json';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    // console.log('env variables', process.env.host)
    console.log('kanjiRoute attempted to run...');
    const queryData =  await pool.query('SELECT * FROM public."wordObject"');
    // console.log('queryData: ', queryData);
    response.status(200).json(queryData);
    // await pool.end()
  } catch (error) {
    response.status(500).json({ message: 'failed to load data', error: error.message })
    // await pool.end()
  }
};