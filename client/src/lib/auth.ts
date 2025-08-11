import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const res = await axios.post(`${process.env.BACKEND_URL}/auth/google`, {
          name: user.name,
          email: user.email,
          avatar_url: user.image,
        });

        token.hasuraToken = res.data.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.hasuraToken = token.hasuraToken;
      return session;
    },
  },
};
