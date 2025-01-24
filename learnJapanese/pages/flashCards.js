import Link from 'next/link'
import utilStyles from '../styles/utils.module.css';

export default function flashCards() {
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
        </>
      );
  }