import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import WordCard from './wordCardComponent';
import kanjiData from '../public/data/kanji.json';
import Card from '../objects/wordCardObject'
import { GetServerSideProps } from 'next';

const name = 'Vaughn';

// interface Props {
//   cardsProp: Card[];
// }

export default function Layout({ }) {
  
  const [data, setData] = useState<Card[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/kanjiRoute');
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


  const populateCards = async () => {
    let cards : Card[] = kanjiData;
    
    const response = await fetch('http://localhost:3000/api/kanjiRoute');
    const data = await response.json();

    if(data.rows.length > 0) {
      cards = data.rows;
    }

      // return
      // (
      //   cards.map
      //   (
      //     (item) => 
      //     (
      //       <WordCard
      //         key = {item.id}
      //         id = {item.id}
      //         kanji = {item.kanji}
      //         pronounce= {item.pronounce}
      //         translation = {item.translation}
      //         learned = {item.learned}
      //       >
      //       </WordCard>
      //     )
      //   )
      // );

    return cards;
  }

  // const getCards = () => {
  //   const cards = populateCards().then();

  //   return populateCards();
  // }



  const testButton = async () => {
    const response = await fetch('http://localhost:3000/api/kanjiRoute');
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


  // const getServerSideProps: GetServerSideProps = async () => {
  //   const response = await fetch('http://localhost:3000/api/kanjiRoute');
  //   const data = await response.json();

  //   return {
  //     props: {
  //       cards: data.rows,
  //     },
  //   };
  // };

  return (
    <>
    <button onClick={testButton}>
      click me
    </button>
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
              learned = {item.learned}
            >
            </WordCard>
          )
        )
      // for await (card of populateCards()) {
      //   console.log("test")
      // }
        // const cards = await populateCards();

        // populateCards().map
        // (
        //   (item) => 
        //   (
        //     <WordCard
        //       key = {item.id}
        //       id = {item.id}
        //       kanji = {item.kanji}
        //       pronounce= {item.pronounce}
        //       translation = {item.translation}
        //       learned = {item.learned}
        //     >
        //     </WordCard>
        //   )
        // )
      }
    </>

  );
}