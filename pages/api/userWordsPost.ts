import type { NextApiRequest, NextApiResponse } from "next";
import pool from '../../dbconnection';
import UserWord from '../../objects/userWordObject'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const client = await pool.connect(); // Get a client for the transaction
  try {
    console.log('userWordsPost attempted to run...');

    // const conversion : UserWord[] = JSON.parse(request.body);
    const headerUpdates : UserWord[] = JSON.parse(request.headers["updates"].toString());
    const headerInserts : UserWord[] = JSON.parse(request.headers["inserts"].toString());

    if(headerUpdates.length == 0 && headerInserts.length == 0) {
      throw Error('No data to post.');
      response.status(500).json({message: 'No data to post.'});
      return;
    }
    // const headerInserts = request.headers["inserts"];

    // const queryData =  await pool.query('INSERT INTO public.user_words (word_object_id, learning, learned) VALUES (1, true, false);');
    let insertString = 'INSERT INTO public.user_words (word_object_id, learning, learned, user_id) VALUES';
    if(headerInserts.length > 0) {
      for(let i = 0; i < headerInserts.length; i++){
        insertString += ' (' + headerInserts[i].word_object_id + ', ' + headerInserts[i].learning + ', ' + headerInserts[i].learned + ', ' + headerInserts[i].user_id + ')';
        if(i != headerInserts.length - 1) {
          insertString += ','
        }
      }
      insertString += ';';
    }

    let updateString = 'UPDATE public.user_words AS U SET learning = tt.learning, learned = tt.learned FROM (VALUES';
    if(headerUpdates.length > 0) {
      for(let i = 0; i < headerUpdates.length; i++){
        updateString += ' (' + headerUpdates[i].word_object_id + ', ' + headerUpdates[i].learning + ', ' + headerUpdates[i].learned + ')';
        if(i != headerUpdates.length - 1) {
          updateString += ','
        }
      }
      updateString += ') AS tt (word_object_id, learning, learned) WHERE U.word_object_id = tt.word_object_id;';
    }

    // const queryResult = await Promise.all([
    //   pool.query(insertString),
    //   pool.query(updateString),
    // ]);
    await client.query("BEGIN"); // Start transaction

    if(headerInserts.length > 0) {
      await client.query(insertString);
    }
    if(headerUpdates.length > 0) {
      await client.query(updateString);
    }

    await client.query("COMMIT"); // Commit transaction

    response.status(200).json("transaction successful");

  } catch (error) {
    await client.query("ROLLBACK"); // Undo changes on error
    response.status(500).json({ message: 'Transaction failed to post data', error: error.message })

  } finally {
    client.release();
  }
};
