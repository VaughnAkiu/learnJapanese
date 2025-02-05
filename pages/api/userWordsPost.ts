import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../server.js';
import UserWord from '../../objects/userWordObject'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    console.log('userWordsPost attempted to run...');

    const conversion : UserWord[] = JSON.parse(request.body);
    // console.log('userWordsPost request', request.body, conversion);
    const headerUpdates : UserWord[] = JSON.parse(request.headers["updates"].toString());
    const headerInserts : UserWord[] = JSON.parse(request.headers["inserts"].toString());
    // const headerInserts = request.headers["inserts"];
    console.log('updates headers', headerUpdates);
    console.log("inserts headers", headerInserts);

    const queryData =  await pool.query('SELECT * FROM public.user_words');
    // const queryData =  await pool.query('INSERT INTO public.user_words (word_object_id, learning, learned) VALUES (1, true, false);');
    let insertString = 'INSERT INTO public.user_words (word_object_id, learning, learned) VALUES';
    for(let i = 0; i < headerInserts.length; i++){
      insertString += ' (' + headerInserts[i].word_object_id + ', ' + headerInserts[i].learning + ', ' + headerInserts[i].learned + ')';
      if(i != headerInserts.length - 1) {
        insertString += ','
      }
    }
    insertString += ';';
    console.log(insertString);
    let updateString = 'UPDATE public.user_words AS U SET learning = tt.learning, learned = tt.learned FROM (VALUES';
    for(let i = 0; i < headerUpdates.length; i++){
      updateString += ' (' + headerUpdates[i].word_object_id + ', ' + headerUpdates[i].learning + ', ' + headerUpdates[i].learned + ')';
      if(i != headerUpdates.length - 1) {
        updateString += ','
      }
    }
    updateString += ') AS tt (word_object_id, learning, learned) WHERE U.word_object_id = tt.word_object_id;';
    console.log(updateString);
    response.status(200).json(queryData);

  } catch (error) {
    response.status(500).json({ message: 'failed to load data', error: error.message })

  }
};