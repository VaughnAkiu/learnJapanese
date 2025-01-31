import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../server.js';
import UserWord from '../../objects/userWordObject'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    console.log('userWordsPost attempted to run...');

    const conversion : UserWord[] = JSON.parse(request.body);
    // console.log('userWordsPost request', request.body, conversion);

    const queryData =  await pool.query('SELECT * FROM public.user_words');
    // const queryData =  await pool.query('INSERT INTO public.user_words (word_object_id, learning, learned) VALUES (1, true, false);');
    let queryString = 'INSERT INTO public.user_words (word_object_id, learning, learned) VALUES';
    for(let i = 0; i < conversion.length; i++){
      queryString += ' (' + conversion[i].word_object_id + ', ' + conversion[i].learning + ', ' + conversion[i].learned + ')';
      if(i != conversion.length - 1) {
        queryString += ','
      }
    }
    queryString += ';';
    console.log(queryString);

    response.status(200).json(queryData);

  } catch (error) {
    response.status(500).json({ message: 'failed to load data', error: error.message })

  }
};