import Head from 'next/head';
import Layout from '../components/layout';
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css';
import { useSession, signIn, signOut } from "next-auth/react"

const siteTitle = 'Learn Japanese';

export default function Home({  }) {
  const { data: session } = useSession();

  // if (session) {
    return (
      <>
        {session ? 
          
          <div className={utilStyles.containerLogin} onClick={() => signOut()}>
            <p>Signed in as {session.user.name}. </p>
            <p>Click to sign out...</p>
          </div>
          
        : 
          <div className={utilStyles.containerLogin} onClick={() => signIn()}>
              <h3>Sign in </h3>
          </div>
        }
        <Head>
            <title>{siteTitle}</title>
        </Head>
        <div className={utilStyles.container}>
         
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
         
        </div>
        {/* <Layout></Layout> */}
      </>
    )
  // }
  return (
    <>

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
