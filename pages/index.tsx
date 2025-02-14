import Head from 'next/head';
import Layout from '../components/layout';
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css';
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from 'react';
import Modal from '../components/modal';

const siteTitle = 'Learn Japanese';

export default function Home({  }) {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);

  const signInButtonClick = () => {
    signIn();
    setShowModal(false);
  };

  const popupCenter = (url, title) => {
    const dualScreenLeft = window.screenLeft ?? window.screenX;
    const dualScreenTop = window.screenTop ?? window.screenY;
    const width =
      window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;

    const height =
      window.innerHeight ??
      document.documentElement.clientHeight ??
      screen.height;

    const systemZoom = width / window.screen.availWidth;

    const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
    const top = (height - 550) / 2 / systemZoom + dualScreenTop;

    const newWindow = window.open(
      url,
      title,
      `width=${500 / systemZoom},height=${550 / systemZoom
      },top=${top},left=${left}`
    );

    newWindow?.focus();
  };

  if (status === "authenticated") {
    return (
      <div>
        < h2 > Welcome {session.user.email} 😀</h2 >
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }
  else if (status === "unauthenticated") {
    return (
      <div>
        <h2>Please Login</h2>
        <button onClick={() => popupCenter("/google-signin", "Sample Sign In")} >
          Sign In with Google
        </button>
      </div>
    )
  }

    return (
      <>
        {session ? 
          
          <div className={utilStyles.containerLogin} onClick={() => signOut()}>
            Signed in as {session.user.name}.<br/>
            Click to sign out...
          </div>
          
        : 
          <div className={utilStyles.containerLogin} onClick={() => setShowModal(true)}>
              Sign in
          </div>
        }
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h2>Sign In</h2>
        <button onClick={signInButtonClick}>Sign in with your account</button>
      </Modal>
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
                pick the kanji you want to show up in your flash card deck...
                <p></p>
                <li>
                  <Link href="flashCards">Flash Cards</Link>
                </li>
                go to your flash card deck...
        </div>
        {/* <Layout></Layout> */}
      </>
    )

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
