import React, {useEffect, useState} from 'react';
import utilStyles from '../styles/utils.module.css';
import WordCard from './wordCardComponent';
import Card from '../objects/wordCardObject'


const name = 'Learn Kanji';


export default function Layout({ }) {
  
  const [data, setData] = useState<Card[]>();
  const [loading, setLoading] = useState(true);




  // const populateCards = async () => {
  //   let cards : Card[] = kanjiData;
    
  //   const data = await response.json();

  //   if(data.rows.length > 0) {
  //     cards = data.rows;
  //   }

  //   return cards;
  // }




  return (
    <>
      <div className={utilStyles.container}>
        <header>
            <>
              <h2 className={utilStyles.headingLg}>
                  {name}
              </h2>
              <p>flash cards (hover over them)</p>
            </>
        </header>
      </div>
      {
        loading ? <div>loading data...</div> :
        data.map
        (
          (item) => 
          (
            <WordCard
              key = {item.id}
              id = {item.id}
              kanji = {item.kanji}
              pronounciation= {item.pronounciation}
              translation = {item.translation}
              example = {item.example}
              example_translation={item.example_translation}
            >
            </WordCard>
          )
        )
      }
    </>

  );
}