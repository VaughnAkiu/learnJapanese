import Head from 'next/head';
import Layout from '../components/layout';
import Link from 'next/link'

const siteTitle = 'Practice Web App';

export default function Home({  }) {
  return (
    <>
      <li>
        <Link href="chooseKanji">Choose Kanji</Link>

      </li>
      <li>
        <Link href="flashCards">Flash Cards</Link>
      </li>
      <Head>
          <title>{siteTitle}</title>
      </Head>
      <Layout></Layout>
    </>
  );
}
