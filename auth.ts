import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: "HECoSgtUHqOtazGZMu5eC4CBHUdN8TirpwS1CflVq0M=",
  trustHost: true,
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
          id: randomUUID(),
          email: user.email,
          name: user.name,
          image: user.image,
        },
      });
      return true;
    },
    async session({ session, token }) {
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
        }
      }
      return session;
    },
  },
});