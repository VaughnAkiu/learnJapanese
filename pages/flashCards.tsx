import Link from 'next/link'
import utilStyles from '../styles/utils.module.css';
import React, {useEffect, useState} from 'react';
import Card from '../objects/wordCardObject'
import UserWord from '../objects/userWordObject'
import FlashCardDeck from '../components/flashCardDeckComponent';
import Head from 'next/head';
import { useSession } from 'next-auth/react';

const siteTitle = 'Learn Japanese';

export default function flashCards() {

    const { data: session, status } = useSession();
    const [userId, setUserId] = useState(1);

    const [flashCards, setFlashCards] = useState<Card[]>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          
          const wordObjectResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + 'wordObjectGet');
          const wordObjectResult = await wordObjectResponse.json();

          let headers = {};

          console.log('chooseKanji session ', session);
          if(session && 'user_id' in session.user  && session.user.user_id) {
            setUserId(Number(session.user.user_id));
            headers = {
              "user_id": `${session.user.user_id}`,
            };
          } else {
            headers = {
              "user_id": `${userId}`,
            };
          } 
          const request =
          {
            method: 'GET',
            headers: headers,
          };
          const userWordsResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + 'userWordsGet', request);
          const userWordsResult = await userWordsResponse.json();

          // if no user words, add a dummy user word (to create a single flashcard as an example)
          if(userWordsResult.rows.length == 0) {
            const dummyUserWord : UserWord = {    
              word_object_id: 1,
              learning: true,
              learned: false,
              user_id: userId
            };
            userWordsResult.rows.push(dummyUserWord);
          }
          const flashCards = createFlashCards(wordObjectResult.rows, userWordsResult.rows);
          shuffleCards(flashCards);
          setFlashCards(flashCards);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

    // only create flash cards for objects with learning tag
    const createFlashCards = (kanjiCards : Card[], userWords : UserWord[]) =>
    {
      const flashCardsLocal : Card[] = [];

      // console.log("test kanjiCards", kanjiCards);
      // console.log("test userWords", userWords);
      // todo(low prio): nested loop, optimize?
      for(let i = 0; i < userWords.length; i++)
      {
        if(userWords[i].learning) {
          for(let j = 0; j < kanjiCards.length; j++)
            {
                if(userWords[i].word_object_id == kanjiCards[j].id)
                  {
                    flashCardsLocal.push(kanjiCards[j]);
                    break;
                  }
              // console.log("test loop iteration", j);
            }
        }
      }

      // console.log("test flashCards", flashCards);
      return flashCardsLocal;
    }

    // todo: cleanup / optimize?
    const shuffleCards = (flashCardsLocal : Card[]) =>
    {
      // let j = 0;
      // let x : Card = flashCardsLocal[0];

      for (let i = flashCardsLocal.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        const x  = flashCardsLocal[i];
        flashCardsLocal[i] = flashCardsLocal[j];
        flashCardsLocal[j] = x;
      }
      // console.log('shuffled cards', flashCardsLocal);
      return flashCardsLocal;
    }

    // todo: optimize lol
    const randomizeFlashCards = (flashCardsLocal : Card[]) =>
    {
      const randomizedFlashCards : Card[] = [];
      const min = 1;
      let max = flashCardsLocal.length;
      let rando = 0;
      // generate deck order
      const deckOrder : number[] = [];
      // loop over whole deck
      for(let i = 0; i < flashCardsLocal.length; i++) {
        for(let i = 0; i < max; i++){
          rando = Math.floor(Math.random() * (max - min + 1) + min);
          // console.log('random', rando);
        }
        max--;
      }


      return randomizedFlashCards;
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
                  Flash Cards
              </h2>
              <p>click flashcard to flip</p>
              <li>
              <Link href="/">Home</Link>
              </li>
                Back to home page...
                <p></p>
              <li>
                <Link href="chooseKanji">Choose Kanji</Link>
              </li>
              pick the kanji you want to show up in your flash card deck...
            </>
        </header>
      </div>
        {
        loading ? <div>loading data...</div> :
        <FlashCardDeck cards={flashCards}></FlashCardDeck>
        }
      </>
      );
  }