import Link from 'next/link'
import utilStyles from '../styles/utils.module.css';
import React, {useEffect, useState} from 'react';
import Card from '../objects/wordCardObject'
import UserWord from '../objects/userWordObject'
import UserWordMap from '../objects/userWordMapObject'
import WordCard from '../components/wordCardComponent';
import FlashCardDeck from '../components/flashCardDeckComponent';

export default function flashCards() {

    const [initialData, setInitialData] = useState<Card[]>();
    const [data, setData] = useState<Card[]>();
    const [flashCards, setFlashCards] = useState<Card[]>();

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
          const flashCards = createFlashCards(result.rows, userWordsResult.rows);
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
      console.log('shuffled cards', flashCardsLocal);
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
          console.log('random', rando);
        }
        max--;
      }


      return randomizedFlashCards;
    }
  

    return (
        <>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="chooseKanji">Choose Kanji</Link>
          </li>
          <div className={utilStyles.container}>
        <header>
            <>
              <h2 className={utilStyles.headingLg}>
                  Flash Cards
              </h2>
              <p>click to flip flash card, click again to move to next</p>
            </>
        </header>
      </div>
      <div className={utilStyles.container}>
            kanji 1
        </div>
        {
        loading ? <div>loading data...</div> :
        <FlashCardDeck cards={flashCards}></FlashCardDeck>
      }
        </>
      );
  }