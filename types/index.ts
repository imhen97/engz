/**
 * Main types export file
 * 
 * This file re-exports all type definitions for easy importing throughout the application.
 * 
 * Usage:
 * import { UserRole, UserWithRelations } from "@/types";
 * import type { Question, TestResult } from "@/types";
 */

// User types
export type {
  UserRole,
  SubscriptionPlan,
  UserWithRelations,
  UserSession,
  UserWithSubscription,
  UserSelect,
  KakaoProfile,
} from "./user";

// Level test types
export type {
  TestSection,
  DifficultyLevel,
  QuestionType,
  Question,
  GrammarQuestion,
  VocabularyQuestion,
  WritingPrompt,
  TestAnswer,
  TestResult,
  LevelTestSubmission,
  LevelTestData,
  WritingGradingRequest,
  WritingGradingResponse,
} from "./leveltest";

// Routine types
export type {
  RoutineTheme,
  MissionWithRoutine,
  RoutineWithMissions,
  RoutineWithRelations,
  MissionCreateData,
  RoutineCreateRequest,
  RoutineCreateResponse,
  RoutineData,
} from "./routine";

// API types
export type {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
  SuccessResponse,
  RouteHandlerContext,
  NextAuthRouteContext,
} from "./api";

// Stripe types
export type {
  StripeCustomerWithEmail,
  StripeSubscriptionWithCustomer,
  PaymentData,
} from "./stripe";
