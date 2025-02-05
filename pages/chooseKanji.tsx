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
    // todo maybe: address case when a checkbox was clicked then unclicked (it was added to changedData but there was no actual change) // this isnt even necessary is it?
      // need to compare with initial data set
      
    const learningCheckbox =  (kanjiId : number, learningParam : boolean, learnedParam : boolean) => 
    {
        const newLearningValue = !learningParam;

        const newUserWordMap = userWordMap.map((row) => row.word_object_id === kanjiId ? {...row, learning : newLearningValue} : row);

        setUserWordMap(newUserWordMap);
        const changedUserWord : UserWord = 
        {
          word_object_id : kanjiId,
          learned : learnedParam,
          learning : newLearningValue
        };


        // add row to changed user data
        // check is changed user data has any objects
        if (changedUserData && changedUserData.length > 0) 
        {
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
            setChangedUserData((changedUserData) => [...changedUserData, changedUserWord]);
          }
        }
        // if no objects, create the first changed object and insert
        else
        {
          const newChangedUserData : UserWord[] = 
          [
            changedUserWord
          ];
          setChangedUserData(newChangedUserData);
        }
    }

    // todo maybe: this can be optimized , multiple loops
    const learnedCheckbox =  (kanjiId : number, learnedParam : boolean, learningParam : boolean) => 
    {
      const newLearnedValue = !learnedParam;

      const newUserWordMap = userWordMap.map((row) => row.word_object_id === kanjiId ? {...row, learned : newLearnedValue} : row);

      setUserWordMap(newUserWordMap);

      const changedUserWord : UserWord = 
      {
        word_object_id : kanjiId,
        learned : newLearnedValue,
        learning : learningParam
      };


      // add row to changed user data
      // check is changed user data has any objects
      if (changedUserData && changedUserData.length > 0) 
      {
        let changedEntryAlreadyExists = false;
        for(let i = 0; i < changedUserData.length; i++) {
          // if already exists, edit existing entry
          if (changedUserData[i].word_object_id == kanjiId) {
            

            const newChangedUserData : UserWord[] = changedUserData.map((userWord) => userWord.word_object_id == kanjiId ? {...userWord, learned : newLearnedValue} : userWord );
            setChangedUserData(newChangedUserData);
            changedEntryAlreadyExists = true;
            break;
          }
        }
        // if doesnt already exist add a new entry
        if(!changedEntryAlreadyExists) {
          setChangedUserData((changedUserData) => [...changedUserData, changedUserWord]);
        }
      }
      // if no objects, create the first changed object and insert
      else
      {
        const newChangedUserData : UserWord[] = 
        [
          changedUserWord
        ];
        setChangedUserData(newChangedUserData);
      }
    }


    const calculateDatabaseTransaction = () => {
      let inserts : UserWord[] = [];
      let updates : UserWord[] = [];
      // let deletes : UserWord[] = [];

      // need to keep track of new inserts and updates to existing rows
      // updates to existing rows
      //compare all changes with initial changes variable
      if(changedUserData) {
        for(let i = 0; i < changedUserData.length; i++) {
          let updateableEntryExists = false;
          for(let j = 0; j < userWordsData.length; j++) {
            // check if userWords object id already existed, if so add to updates, if not add to inserts
  
            if(changedUserData[i].word_object_id == userWordsData[j].word_object_id) {
              // also make sure the changed values are not the same as the initial values currently in the db (updating a row with the same values)
              if(changedUserData[i].learned != userWordsData[j].learned || changedUserData[i].learning != userWordsData[j].learning) {
                updates.push(changedUserData[i]);
                              // todo maybe: if id existed and both learning / learned are false consider deleting entry. would decrease db table size (negligible) and also increase identity column usage
              }
              updateableEntryExists = true;
            }
          }
  
          // check if userWords object id already existed, if not add to inserts
          if(!updateableEntryExists) {
            inserts.push(changedUserData[i]);
          }
        }
      }
      
      //update inserts / updates in state or return two arrays (tuple)
      return [inserts, updates];

    }

    const submitButton = async () =>
    {
      const [inserts, updates] = calculateDatabaseTransaction();
      console.log("inserts", inserts, "updates", updates);
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
      // console.log('submit button,', request);
      // compares initial data with changed data and posts a query to change the db accordingly
      // const userWordsResponse = await fetch('http://localhost:3000/api/userWordsPost', request);
      // or i could make a object that holds the changes as they are made (better i think)
    }

    const testButton = () =>
    {
      console.log("testing learningCheckbox, keeping track of changed", changedUserData);
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
        <button onClick={() => testButton()}>test</button>
        </>
      );
  }