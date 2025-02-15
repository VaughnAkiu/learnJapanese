import Head from 'next/head';
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css';
import { useSession, signOut } from "next-auth/react"

const siteTitle = 'Learn Japanese';

export default function Home({  }) {
  const { data: session, status } = useSession();

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

    return (
      <>
        {status === "authenticated" ? 
          
          <div className={utilStyles.containerLogin} onClick={() => signOut()}>
            Signed in as {session.user.name}<br/>
            Click to sign out...
          </div>
          
        : 
          <div className={utilStyles.containerLogin} onClick={() => popupCenter("/auth/sign_in", "Sign In") }>
              Sign in
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
}
