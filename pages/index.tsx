import Head from 'next/head';
import Layout from '../components/layout';
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css';
import { useSession, signIn, signOut } from "next-auth/react"

const siteTitle = 'Learn Japanese';

export default function Home({  }) {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </> )


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
