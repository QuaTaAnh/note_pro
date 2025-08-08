import axios from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const res = await axios.post(`${process.env.BACKEND_URL}/auth/google`, {
          name: user.name,
          email: user.email,
          avatar_url: user.image,
        });

        token.hasuraToken = res.data.token;
        token.workspaceSlug = res.data.workspaceSlug;
      }

      return token;
    },

    async session({ session, token }) {
      session.hasuraToken = token.hasuraToken;
      session.workspaceSlug = token.workspaceSlug;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
