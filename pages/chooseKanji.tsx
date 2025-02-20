import Link from 'next/link'
import utilStyles from '../styles/utils.module.css';
import React, {useEffect, useState} from 'react';
import Card from '../objects/wordCardObject'
import UserWord from '../objects/userWordObject'
import UserWordMap from '../objects/userWordMapObject'
import Head from 'next/head';
import { useSession } from 'next-auth/react';
// import { GetServerSideProps } from "next";

const siteTitle = 'Learn Japanese';

export default function chooseKanji() {

    // user kanji-word cards have no reason to be grabbed multiple times. it is an immutable dataset

    const { data: session, status } = useSession();

    const [userWordsData, setUserWordsData] = useState<UserWord[]>();
    const [changedUserData, setChangedUserData] = useState<UserWord[]>();

    const [userWordMap, setUserWordMap] = useState<UserWordMap[]>();

    const [loading, setLoading] = useState(true);

    const [userId, setUserId] = useState(1);
    // const [count, setCount] = useState(0);
  
    // todo: less calls to the database?
    useEffect(() => {

      // if(!session) {
      //   timeout(10000);
      // }

      if(session && 'user_id' in session.user  && session.user.user_id) {
        setUserId(Number(session.user.user_id));
        // findOrCreateUser();
      }
      loadAllData();
    }, [status, session]);

    // const  timeout = async (delay: number) => {
    //   return await new Promise( res => setTimeout(res, delay) );
    // }


    const loadAllData = async () => {
      try {
        setLoading(true);
        const urlString = process.env.NEXT_PUBLIC_API_URL + 'wordObjectGet';
        const wordObjectResponse = await fetch(urlString);
        const wordObjectResult = await wordObjectResponse.json();

        let headers = {};

        if(session && 'user_id' in session.user  && session.user.user_id) {
          headers = {
            "user_id": `${session.user.user_id}`,
          };
        } else {
          headers = {
            "user_id": `${userId}`,
          };
        } 
        // const requestBody = "Attempting to get user..."

        const request =
        {
          method: 'GET',
          headers: headers,
          // body: requestBody,
        };
        const userWordsResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + 'userWordsGet', request);
        const userWordsResult = await userWordsResponse.json();


        setUserWordsData(userWordsResult.rows);
        const userWordMap = createUserDataMap(wordObjectResult.rows, userWordsResult.rows);
        setUserWordMap(userWordMap);
        setChangedUserData([]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    const findOrCreateUser = async () => {
      if('provider' in session.user && 'id' in session.user && session.user.provider == "github") {
        const headers = {
          "github_id": `${session.user.id}`,
        };
        // const requestBody = "Attempting to get user..."

        const request =
        {
          method: 'GET',
          headers: headers,
          // body: requestBody,
        };
        
        // check if user exists with given github unique id
        const getUserResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + 'userGet', request);
        if(getUserResponse.status == 200) {
          const convertedGetUserResponse =  await getUserResponse.json();
          if(convertedGetUserResponse.rows.length == 0) {
            
            const createUserRequest = {
              method: 'POST',
              headers: headers,
            }

            const createUserResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + 'userPost', createUserRequest);

            const convertedCreateUserResponse = await createUserResponse.json()
            setUserId(convertedCreateUserResponse.rows[0].id);
            return;
          } 
            setUserId(convertedGetUserResponse.rows[0].id);
            return;
        }

      }


    }

    // better to combine data then to use nested loops during render
    const createUserDataMap = (kanjiCards : Card[], userWords : UserWord[]) =>
    {
      const userWordMap : UserWordMap[] = [];

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
              example : kanjiCards[i].example,
              example_translation : kanjiCards[i].example_translation,
            };
            userWordMap.push(userWordMapPiece);
            wordCreated = true;
            break;
          }
        }
        if(!wordCreated){
          const userWordMapPiece : UserWordMap = {
            word_object_id : kanjiCards[i].id,
            learned : false,  // default value 
            learning : false, // default value 
            kanji : kanjiCards[i].kanji,
            pronounciation : kanjiCards[i].pronounciation,
            translation : kanjiCards[i].translation,
            example : kanjiCards[i].example,
            example_translation : kanjiCards[i].example_translation,
          };
          userWordMap.push(userWordMapPiece);
        }


      }
      return userWordMap;
    }

    // todo maybe: this can be optimized , multiple loops
    const learningCheckbox =  (kanjiId : number, learningParam : boolean, learnedParam : boolean) => 
    {
        const newLearningValue = !learningParam;

        const newUserWordMap = userWordMap.map((row) => row.word_object_id === kanjiId ? {...row, learning : newLearningValue} : row);

        setUserWordMap(newUserWordMap);
        const changedUserWord : UserWord = 
        {
          word_object_id : kanjiId,
          learned : learnedParam,
          learning : newLearningValue,
          user_id : userId, // todo: hardcoded for testing
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
        learning : learningParam,
        user_id : userId, // todo: hardcoded for testing
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

      const requestBody = "Attempting to post data..."

      const headers = {
        "inserts": JSON.stringify(inserts),
        "updates": JSON.stringify(updates),
      };

      const request =
      {
        method: 'POST',
        headers: headers,
        body: requestBody,
      };

      const userWordsResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + 'userWordsPost', request);
      await loadAllData();
    }

    const testButton = async () =>
    {
      const headers = {
        "github_id": `${1}`,
      };

      const request =
      {
        method: 'GET',
        headers: headers,
        // body: requestBody,
      };
      
      // check if user exists with given github unique id
      // const getUserResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + 'userGet', request);
    }


    return (
      <>
        <Head>
          <title>{siteTitle}</title>
        </Head>
          <div className={utilStyles.container}>
        <header>
            <>
              <h2 className={utilStyles.headingLg}>
                  Choose Kanji
              </h2>
              <p>Fill in checkboxes and submit to update your flash card deck.</p>
              If you sign in at the home page you can assign a deck to your account...<br/>
              otherwise a master deck is used
              <p>learning = add to flash card deck.</p>
              <p>learned = no functionality yet.</p>

              <Link href="/"><div className={utilStyles.containerSmall}>Home</div></Link>
              

              Back to home page...
              <p></p>
              <li>
                <Link href="flashCards">Flash Cards</Link>
              </li>
              Go to your flash card deck...
              {/* <p>{count}</p> */}
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
        <div className={utilStyles.containerLogin} onClick={() => submitButton()}>submit</div>
        {/* <button onClick={() => testButton()}>test</button> */}
      </>
    );
  }

  // export const getServerSideProps: GetServerSideProps = async () => {
  //   const data = "Fetched on refresh"; // Replace with API call if needed
  
  //   return {
  //     props: { data },
  //   };
  // };