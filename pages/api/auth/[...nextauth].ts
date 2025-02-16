import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

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
    async session({ session, token }) 
    {
        // console.log('session token:', token);
        session.user.id = token.sub;
        session.user.provider = token.provider; // Store provider in session
        return session;
    },
        async jwt({ token, account }) 
    {
        if (account) {
            token.provider = account.provider; // Store provider in JWT token
        }
        return token;
    },
},
}

export default NextAuth(authOptions)