import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config shared with middleware. Deliberately has no providers or
 * adapter - those pull in Prisma Client and bcryptjs, which blow past
 * Vercel's Edge Function size limit. Middleware only needs to verify the JWT
 * and read its claims, not touch the database.
 */
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.role = user.role;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
