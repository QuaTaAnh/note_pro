import axios from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

let hasuraToken: string | null = null;
let workspaceSlug: string | null = null;

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
        workspaceSlug = res.data.workspaceSlug;
      } catch (err) {
        console.error('Backend user sync failed:', err);
      }
      return true;
    },
    async session({ session }) {
      return {
        ...session,
        hasuraToken,
        workspaceSlug
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
