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
    const [changedUserData, setChangedUserData] = useState<UserWord[]>();

    const [initialUserWordMap, setInitialUserWordMap] = useState<UserWordMap[]>();
    const [userWordMap, setUserWordMap] = useState<UserWordMap[]>();

    const [loading, setLoading] = useState(true);
  
    // todo: less calls to the database?
    useEffect(() => {
      const fetchData = async () => {
        try {
          const wordObjectResponse = await fetch('http://localhost:3000/api/wordObjectGet');
          const wordObjectResult = await wordObjectResponse.json();
          const userWordsResponse = await fetch('http://localhost:3000/api/userWordsGet');
          const userWordsResult = await userWordsResponse.json();

          // Assuming all `result.rows` contains the desired data
          // setInitialData(result.rows);
          // setData(result.rows); 
          setUserWordsData(userWordsResult.rows);
          const userWordMap = createUserDataMap(wordObjectResult.rows, userWordsResult.rows);
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

    // todo maybe: this can be optimized , multiple loops
    const learningCheckbox =  (kanjiId : number, learningParam : boolean, learnedParam : boolean) => 
    {
        const newLearningValue = !learningParam;
        // console.log("checkbox clicked", kanjiId, data[kanjiId - 1]);
        // for each row with given id, change row learned value
        const newData = userWordMap.map((row) => row.word_object_id === kanjiId ? {...row, learning : newLearningValue} : row);
        // set state of card
        setUserWordMap(newData);
        const changedUserWord : UserWord = 
        {
          word_object_id : kanjiId,
          learned : learnedParam,
          learning : newLearningValue
        };


        // add row to changed user data
        // what if row already existed? multiple of the same row. we have to check to see if the row already exists, if it does then update that value
        // possible access undefined
        if (changedUserData.length > 0) {
          let changedEntryAlreadyExists = false;
          for(let i = 0; i < changedUserData.length; i++) {
            // if already exists, edit existing entry
            if (changedUserData[i].word_object_id == kanjiId) {
              const newChangedUserData : UserWord[] = changedUserData.map((userWord) => userWord.word_object_id == kanjiId ? {...userWord, learning : newLearningValue} : userWord );
              setChangedUserData(newChangedUserData);
              changedEntryAlreadyExists = true;
              break;
            }
          }
          // if doesnt already exist add a new entry
          if(!changedEntryAlreadyExists) {
            const newChangedUserData : UserWord = 
            {
              word_object_id : kanjiId,
              learned : learnedParam,
              learning : newLearningValue
            };
            setChangedUserData((changedUserData) => [...changedUserData, newChangedUserData]);
          }
        }
        else{
          const newChangedUserData : UserWord[] = 
          [
            {
              word_object_id : kanjiId,
              learned : learnedParam,
              learning : newLearningValue
            }
          ];
          setChangedUserData(newChangedUserData);
        }


    }

    // todo maybe: this can be optimized , multiple loops
    const learnedCheckbox =  (kanjiId : number, learnedParam : boolean, learningParam : boolean) => 
    {
      const newLearnedValue = !learnedParam;
        // console.log("checkbox clicked", kanjiId, data[kanjiId - 1]);
        // for each row with given id, change row learned value
        const newData = userWordMap.map((row) => row.word_object_id === kanjiId ? {...row, learned : newLearnedValue} : row);
        // set state of card
        setUserWordMap(newData);
    }

    const calculateDatabaseTransaction = (changedData : UserWord[]) => {
      let inserts : UserWord[] = [];
      let updates : UserWord[] = [];

      // need to keep track of new inserts and updates to existing rows
      // updates to existing rows
        //compare all changes with initial changes variable
        for(let i = 0; i < changedData.length; i++) {
          let updateableEntryExists = false;
          for(let j = 0; j < userWordsData.length; j++) {
            // check if userWords object id already existed, if so add to updates, if not add to inserts

            if(changedData[i].word_object_id == userWordsData[j].word_object_id) {
              updates.push(changedData[i]);
              updateableEntryExists = true;
                            // todo maybe: if id existed and both learning / learned are false consider deleting entry. would decrease db table size (negligible) and also increase identity column usage
            }
          }

          // check if userWords object id already existed, if not add to inserts
          if(!updateableEntryExists) {
            inserts.push(changedData[i]);
          }
        }
      
        //update inserts / updates in state or return two arrays (tuple)


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
                                <td><input type="checkbox" checked={row.learning} onChange={() => learningCheckbox(row.word_object_id, row.learning, row.learned)}/></td>
                                <td><input type="checkbox" checked={row.learned} onChange={() => learnedCheckbox(row.word_object_id, row.learned, row.learning)}/></td>
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