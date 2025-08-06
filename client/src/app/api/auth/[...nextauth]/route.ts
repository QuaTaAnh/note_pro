import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { NextAuthOptions } from 'next-auth';
import axios from 'axios';

let hasuraToken: string | null = null;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const res = await axios.post(`${process.env.BACKEND_URL}/auth/google`, {
          name: user.name,
          email: user.email,
          avatar_url: user.image,
        });
        hasuraToken = res.data.token;
      } catch (err) {
        console.error('Backend user sync failed:', err);
      }
      return true;
    },
    async session({ session }) {
      return {
        ...session,
        hasuraToken,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
