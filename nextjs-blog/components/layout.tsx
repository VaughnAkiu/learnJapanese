import React from 'react';
import Image from 'next/image';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import WordCard from './wordCardComponent.tsx';
import kanjiData from '../public/data/kanji.json';
import Card from '../objects/wordCardObject.tsx'

const name = 'Alkuroth';

export default function Layout({ }) {
  

  const populateCards = () => {
    const cards : Card[] = kanjiData;

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
            </>
        </header>
      </div>
      {populateCards().map((item) => (
        <WordCard
          key = {item.id}
          id = {item.id}
          kanji = {item.kanji}
          pronounce= {item.pronounce}
          translation = {item.translation}
          learned = {item.learned}
        >
        </WordCard>
       ))}
    </>

  );
}