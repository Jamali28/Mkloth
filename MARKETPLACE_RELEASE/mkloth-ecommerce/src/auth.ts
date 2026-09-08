import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/types/next-auth";
import { prisma } from "@/lib/prisma";

const supabaseProvider: Provider = {
  id: "supabase",
  name: "Google",
  type: "oauth",
  checks: ["pkce", "state"],
  clientId: process.env.SUPABASE_ANON_KEY,
  clientSecret: process.env.SUPABASE_JWT_SECRET,
  authorization: {
    url: `${process.env.SUPABASE_URL}/auth/v1/authorize`,
    params: { provider: "google", scope: "openid email profile" },
  },
  token: `${process.env.SUPABASE_URL}/auth/v1/token`,
  userinfo: `${process.env.SUPABASE_URL}/auth/v1/userinfo`,
  profile(profile: {
    sub: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
  }) {
    return {
      id: profile.sub,
      name: profile.full_name || profile.name || profile.email?.split("@")[0] || "Google User",
      email: profile.email,
      image: profile.picture || profile.avatar_url || undefined,
    };
  },
};

const googleEnabled =
  !!process.env.SUPABASE_URL &&
  !!process.env.SUPABASE_ANON_KEY &&
  !!process.env.SUPABASE_JWT_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    ...(googleEnabled ? [supabaseProvider] : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "supabase") {
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email as string },
          });
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                name: user.name ?? (user.email as string).split("@")[0],
                email: user.email as string,
                password: await bcrypt.hash(
                  Math.random().toString(36).slice(2) + Date.now().toString(36),
                  10
                ),
                role: "USER",
              },
            });
          }
          token.id = dbUser.id;
          token.role = dbUser.role;
        } else {
          token.id = user.id as string;
          token.role = (user as { role?: UserRole }).role;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
  },
});
