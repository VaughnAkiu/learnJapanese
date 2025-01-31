import Link from 'next/link'
import utilStyles from '../styles/utils.module.css';
import React, {useEffect, useState} from 'react';
import Card from '../objects/wordCardObject'
import UserWord from '../objects/userWordObject'
import UserWordMap from '../objects/userWordMapObject'

export default function chooseKanji() {

    // kanji cards have no reason to be grabbed multiple times. it is an immutable dataset
    // todo: update
    const [initialData, setInitialData] = useState<Card[]>();
    const [data, setData] = useState<Card[]>();

    const [userWordsData, setUserWordsData] = useState<UserWord[]>();

    const [initialUserWordMap, setInitialUserWordMap] = useState<UserWordMap[]>();
    const [userWordMap, setUserWordMap] = useState<UserWordMap[]>();

    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/wordObjectGet');
          const result = await response.json();
          const userWordsResponse = await fetch('http://localhost:3000/api/userWordsGet');
          const userWordsResult = await userWordsResponse.json();

          // Assuming all `result.rows` contains the desired data
          // setInitialData(result.rows);
          // setData(result.rows); 
          // setUserWordsData(userWordsResult.rows);
          const userWordMap = createUserDataMap(result.rows, userWordsResult.rows);
          setInitialUserWordMap(userWordMap);
          setUserWordMap(userWordMap);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

    // better to combine data then to use nested loops during render
    const createUserDataMap = (kanjiCards : Card[], userWords : UserWord[]) =>
    {
      const userWordMap : UserWordMap[] = [];

      // console.log("test kanjiCards", kanjiCards);
      // console.log("test userWords", userWords);
      // todo(low prio): nested loop, optimize?
      for(let i = 0; i < kanjiCards.length; i++)
      {
        let wordCreated = false;
        for(let j = 0; j < userWords.length; j++)
        {
          if(userWords[j].word_object_id == kanjiCards[i].id)
          {
            const userWordMapPiece : UserWordMap = {
              word_object_id : kanjiCards[i].id,
              learned : userWords[j].learned,
              learning : userWords[j].learning,
              kanji : kanjiCards[i].kanji,
              pronounciation : kanjiCards[i].pronounciation,
              translation : kanjiCards[i].translation,
            };
            userWordMap.push(userWordMapPiece);
            wordCreated = true;
            break;
          }
          // console.log("test loop iteration", j);
        }
        if(!wordCreated){
          const userWordMapPiece : UserWordMap = {
            word_object_id : kanjiCards[i].id,
            learned : false,  // default value 
            learning : false, // default value 
            kanji : kanjiCards[i].kanji,
            pronounciation : kanjiCards[i].pronounciation,
            translation : kanjiCards[i].translation,
          };
          userWordMap.push(userWordMapPiece);
        }


      }

      // console.log("test userWordMap", userWordMap);
      return userWordMap;
    }

    const learningCheckbox =  (kanjiId : number, learning : boolean) => 
    {
        // console.log("checkbox clicked", kanjiId, data[kanjiId - 1]);
        // for each row with given id, change row learned value
        const newData = userWordMap.map((row) => row.word_object_id === kanjiId ? {...row, learning : !row.learning} : row);
        // set state of card
        setUserWordMap(newData);
        // change learned = false of corresponding id
    }

    const learnedCheckbox =  (kanjiId : number, learned : boolean) => 
      {
          // console.log("checkbox clicked", kanjiId, data[kanjiId - 1]);
          // for each row with given id, change row learned value
          const newData = userWordMap.map((row) => row.word_object_id === kanjiId ? {...row, learned : !row.learned} : row);
          // set state of card
          setUserWordMap(newData);
          // change learned = false of corresponding id
      }

    const changesTracker = () => {
      let inserts : UserWord[] = [];
      let updates : UserWord[] = [];

      // need to keep track of new inserts and updates to existing rows
      // updates to existing rows
        //compare all changes with initial changes variable
        for(let i = 0; i < 1; i++) {
          //if there is a match then add to updates variable
          //no match add to inserts variable
        }
      // have a list of existing rows, if any of these have changed then update
    }

    const submitButton = async () =>
    {
      const requestBody : UserWord[] = [
        {
          word_object_id: 1,
          learning: true,
          learned: false,
        },
        {
          word_object_id: 2,
          learning: true,
          learned: false,
        },
      ];

      const request =
      {
        method: 'POST',
        headers: {},
        body: JSON.stringify(requestBody),
      };
      console.log('submit button,', request);
      // compares initial data with changed data and posts a query to change the db accordingly
      const userWordsResponse = await fetch('http://localhost:3000/api/userWordsPost', request);
      // or i could make a object that holds the changes as they are made (better i think)
    }


    return (
        <>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="flashCards">Flash Cards</Link>
          </li>
          <div className={utilStyles.container}>
        <header>
            <>
              <h2 className={utilStyles.headingLg}>
                  Choose your kanji
              </h2>
              <p>fill in checkboxes and submit to update the main list</p>
            </>
        </header>
      </div>
      <div className={utilStyles.containerChooseKanji}>
        <table>
            <thead>
                <tr>
                    <th>Kanji</th>
                    <th>Pronounciation</th>
                    <th>Translation</th>
                    <th>Learning</th>
                    <th>Learned</th>
                </tr>
            </thead>
            <tbody>
                {loading ? <tr><td>loading data...</td></tr> :
                userWordMap.map
                    (
                        (row) => 
                        (
                            <tr key={row.word_object_id}>
                                <td>{row.kanji}</td>
                                <td>{row.pronounciation}</td>
                                <td>{row.translation}</td>
                                <td><input type="checkbox" checked={row.learning} onChange={() => learningCheckbox(row.word_object_id, row.learning)}/></td>
                                <td><input type="checkbox" checked={row.learned} onChange={() => learnedCheckbox(row.word_object_id, row.learned)}/></td>
                            </tr>
                        )
                    )
                }
            </tbody>
        </table>
        </div>
        <button onClick={() => submitButton()}>submit</button>
        </>
      );
  }