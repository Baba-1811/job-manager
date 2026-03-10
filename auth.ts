import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name, image: user.image },
        create: {
          id: user.id!,
          email: user.email,
          name: user.name,
          image: user.image,
        },
      });
      return true;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    },
  },
});