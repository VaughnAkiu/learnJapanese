import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../server.js';
// import kanjiData from '/kanji';
// import kanjiData from '../public/data/kanji.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('env variables', process.env.host)
    const data =  await pool.query('SELECT * FROM public."wordObject"');
    res.status(200).json(data);
    // await pool.end()
  } catch (error) {
    res.status(500).json({ message: 'failed to load data', error: error.message })
    // await pool.end()
  }
};