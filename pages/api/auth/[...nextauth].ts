import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

// let userId = 0;

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: 
  {
    async signIn({ user, account, profile }) {
      console.log("next-auth user signed in... user, account, profile", user, account, profile);
    

        if(account.provider == "github") {
          console.log("github signIn callback, account.provider = github true");
          const headers = {
            "github_id": `${user.id}`,
          };
          // const requestBody = "Attempting to get user..."
    
          const request =
          {
            method: 'GET',
            headers: headers,
            // body: requestBody,
          };
          
          // check if user exists with given github unique id
          console.log("github signIn callback, about to await promise 1000ms");
          await new Promise(r => setTimeout(r, 1000));
          console.log("github signIn callback, wait 1000ms success, about to fetch userGet");
          const getUserResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + 'userGet', request);
          console.log("github signIn callback, fetch success, returned getUserResponse: ", getUserResponse);
          if(getUserResponse.status == 200) {
            console.log("github signIn callback, getUserResponse = success");
            const convertedGetUserResponse =  await getUserResponse.json();
            if(convertedGetUserResponse.rows.length == 0) {
              
              const createUserRequest = {
                method: 'POST',
                headers: headers,
              }
    
              const createUserResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + 'userPost', createUserRequest);
              // console.log("createUserResponse response: ", await createUserResponse.json());
              const convertedCreateUserResponse = await createUserResponse.json();
              // userId = convertedCreateUserResponse.rows[0].id;
              user.userId = convertedCreateUserResponse.rows[0].id;
              return true;
            } 
              // userId = convertedGetUserResponse.rows[0].id;
              user.userId = convertedGetUserResponse.rows[0].id;
              console.log("github signIn callback, user.userId:", user.userId);
              return true;
            // console.log("getUserResponse", await getUserResponse.json());
          }
          // console.log("getUserResponse", await getUserResponse.json());
    
        }
      return true;
    },
    async jwt({ token, account, user }) 
    {
        if (account) {
          token.provider = account.provider; // Store provider in JWT token
        }
        if(user) {
          token.user_id = user.userId;
        }
        return token;
    },
    async session({ session, token }) 
    {
        // console.log('session token:', token);
        session.user.id = token.sub;
        session.user.provider = token.provider; // Store provider in session
        // session.user.user_id = userId;
        session.user.user_id = token.user_id;
        console.log('next-auth session:', session);
        return session;
    },
},
}

export default NextAuth(authOptions)