import { useState } from 'react';
import React from 'react';
import Image from 'next/image';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import WordCard from './wordCardComponent.tsx';
import kanjiData from '../public/data/kanji.json';
import Card from '../objects/wordCardObject.tsx'

const name = 'Alkuroth';

export default function Layout({ }) {
  
  // const [data, setData] = useState(null);

  const populateCards = () => {
    const cards : Card[] = kanjiData;
    // const dataStringified = JSON.stringify(kanjiData, null, 2);

    // console.log(dataStringified);

    console.log(cards[0].kanji);
    console.log(cards[0].learned);
    console.log(cards[0].translation);
    console.log(cards[1].kanji);
    console.log(cards[1].learned);



    // Object.entries(data).map(([key, value]) => (Array.isArray(value) ? value.join(", ") : value.toString()))

    // Object.keys(data).map((key) => (console.log(data[key])));

    // Object.values(data).map((value, index) => 
    //   ( console.log(value) ) )

    return cards;
  }

  return (
    <>
      <div className={utilStyles.container}>
        <header>
            <>
              <Link href="/">
                <Image
                  priority
                  src="/images/profile.png"
                  className={utilStyles.borderCircle}
                  height={125}
                  width={125}
                  alt=""
                />
              </Link>
              <h2 className={utilStyles.headingLg}>
                  {name}
              </h2>
              <p>
                {/* {populateCards()} */}
              </p>
            </>
        </header>
      </div>
      {populateCards().map((item) => (
        <WordCard
          key = {item.id}
          id = {item.id}
          kanji = {item.kanji}
          translation = {item.translation}
          learned = {item.learned}
        >
        </WordCard>
       ))}





        {/* <WordCard
          id = {1}
          kanji = {populateCards()[0].kanji}
          translation = 'ところ, place'
          learned = {false}
        >

        </WordCard> */}
      
      {/* <WordCard
        id = {1}
        kanji ='所'
        translation = 'ところ, place'
        learned = {false}
        // lastStudied = {}
      >
      </WordCard>
      <WordCard
        id = {2}
        kanji ='使う'
        translation = 'つかう, to use, to make use of (something)'
        learned = {false}
        // lastStudied = {}
      >
      </WordCard>
      <WordCard
        id = {3}
        kanji ='する'
        translation = 'to do, to make, to have, to play, to wear, etc'
        learned = {false}
        // lastStudied = {}
      >
      </WordCard> */}
    </>

  );
}