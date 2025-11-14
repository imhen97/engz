import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan: string;
      trialActive: boolean;
      trialEndsAt?: Date | null;
      subscriptionActive: boolean;
      role?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    plan: string;
    trialActive: boolean;
    trialEndsAt: Date | null;
    subscriptionActive: boolean;
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    plan?: string;
    trialActive?: boolean;
    trialEndsAt?: string | null;
    subscriptionActive?: boolean;
    role?: string | null;
  }
}
