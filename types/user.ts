import type {
  User as PrismaUser,
  Routine,
  LevelTestResult,
  Course,
  Enrollment,
} from "@prisma/client";

/**
 * User role types
 */
export type UserRole = "admin" | "coach" | null;

/**
 * Subscription plan types
 */
export type SubscriptionPlan = "free" | "monthly" | "annual";

/**
 * User with optional relations
 */
export interface UserWithRelations extends PrismaUser {
  routines?: Routine[];
  levelTestResults?: LevelTestResult[];
  currentRoutine?: Routine | null;
  currentCourse?: Course | null;
  enrollments?: Enrollment[];
}

/**
 * User session data (for NextAuth)
 */
export interface UserSession {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  plan: SubscriptionPlan;
  trialActive: boolean;
  trialEndsAt: Date | null;
  subscriptionActive: boolean;
}

/**
 * User with subscription status (for admin pages)
 */
export interface UserWithSubscription {
  id: string;
  name: string | null;
  email: string | null;
  plan: SubscriptionPlan;
  trialActive: boolean;
  trialEndsAt: Date | null;
  subscriptionActive: boolean;
  role: UserRole;
  createdAt: Date;
}

/**
 * Prisma User select type for admin queries
 */
export type UserSelect = {
  id: true;
  name: true;
  email: true;
  plan: true;
  trialActive: true;
  trialEndsAt: true;
  subscriptionActive: true;
  role: true;
  createdAt: true;
  levelTestResults?: {
    take: number;
    orderBy: { createdAt: "desc" };
    select: { overallLevel: true };
  };
};

/**
 * Kakao OAuth profile structure
 */
export interface KakaoProfile {
  id: number;
  kakao_account?: {
    email?: string;
    is_email_verified?: boolean;
    name?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
  properties?: {
    nickname?: string;
    profile_image?: string;
  };
}
