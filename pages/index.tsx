import Head from 'next/head';
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css';
import { useSession, signOut } from "next-auth/react"
import React, {useState} from 'react';

const siteTitle = 'Learn Japanese';

export default function Home({  }) {
  const { data: session, status } = useSession();

    // const [count, setCount] = useState(0);
  
    // todo: less calls to the database?

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

  // const findOrCreateUser = async () => {
  //   if('provider' in session.user && 'id' in session.user && session.user.provider == "github") {
  //     const headers = {
  //       "github_id": `${session.user.id}`,
  //     };
  //     // console.log("headers findOrCreateUser", headers);
  //     // const requestBody = "Attempting to get user..."

  //     const request =
  //     {
  //       method: 'GET',
  //       headers: headers,
  //       // body: requestBody,
  //     };
      
  //     // check if user exists with given github unique id
  //     const getUserResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + 'userGet', request);
  //     if(getUserResponse.status == 200) {
  //       const convertedGetUserResponse =  await getUserResponse.json();
  //       if(convertedGetUserResponse.rows.length == 0) {
          
  //         const createUserRequest = {
  //           method: 'POST',
  //           headers: headers,
  //         }

  //         const createUserResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + 'userPost', createUserRequest);
  //         // console.log("createUserResponse response: ", await createUserResponse.json());
  //         const convertedCreateUserResponse = await createUserResponse.json()
  //         setUserId(convertedCreateUserResponse.rows[0].id);
  //         return;
  //       } 
  //         setUserId(convertedGetUserResponse.rows[0].id);
  //         return;
  //       // console.log("getUserResponse", await getUserResponse.json());
  //     }
  //     // console.log("getUserResponse", await getUserResponse.json());

  //   }


  // }

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
