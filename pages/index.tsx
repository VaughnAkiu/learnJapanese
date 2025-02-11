import Head from 'next/head';
import Layout from '../components/layout';
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css';

const siteTitle = 'Learn Japanese';

export default function Home({  }) {
  return (
    <>
      <Head>
          <title>{siteTitle}</title>
      </Head>
      <div className={utilStyles.container}>
        <header>
            <>
              <h2 className={utilStyles.headingLg}>
                  Kanji memorization aid
              </h2>
              <li>
              <Link href="chooseKanji">Choose Kanji</Link>
              </li>
              <p>pick the kanji you want to show up in your flash card deck...</p>
              <li>
                <Link href="flashCards">Flash Cards</Link>
              </li>
              <p>go to your flash card deck...</p>
            </>
        </header>
      </div>
      {/* <Layout></Layout> */}
    </>
  );
}
