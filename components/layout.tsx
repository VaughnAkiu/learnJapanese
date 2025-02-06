import React, {useEffect, useState} from 'react';
import utilStyles from '../styles/utils.module.css';
import WordCard from './wordCardComponent';
import kanjiData from '../public/data/kanji.json';
import Card from '../objects/wordCardObject'


const name = 'Learn Kanji';


export default function Layout({ }) {
  
  const [data, setData] = useState<Card[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/wordObjectGet');
        const result = await response.json();

        setData(result.rows); // Assume `result.rows` contains the desired data
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // const populateCards = async () => {
  //   let cards : Card[] = kanjiData;
    
  //   const response = await fetch('http://localhost:3000/api/wordObjectGet');
  //   const data = await response.json();

  //   if(data.rows.length > 0) {
  //     cards = data.rows;
  //   }

  //   return cards;
  // }


  const testButton = async () => {
    const response = await fetch('http://localhost:3000/api/wordObjectGet');
    const data = await response.json();
    if(data.rows.length > 0) {
      const cards : Card[] = data.rows;
      data.rows.forEach((row, index) => {
        console.log("row: ", row, index);
      });
      console.log(cards);
    }

    return;
  }

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