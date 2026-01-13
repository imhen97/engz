import type {
  Routine as PrismaRoutine,
  Mission as PrismaMission,
  Report as PrismaReport,
} from "@prisma/client";

/**
 * Routine theme types
 */
export type RoutineTheme =
  | "Grammar"
  | "Slang"
  | "Business"
  | "Travel"
  | "Speaking"
  | "grammar"
  | "slang"
  | "business"
  | "travel"
  | "speaking";

/**
 * Mission with optional relations
 */
export interface MissionWithRoutine extends PrismaMission {
  routine?: PrismaRoutine | null;
}

/**
 * Routine with missions
 */
export interface RoutineWithMissions extends PrismaRoutine {
  missions: PrismaMission[];
}

/**
 * Routine with missions and report
 */
export interface RoutineWithRelations extends PrismaRoutine {
  missions: PrismaMission[];
  report?: PrismaReport | null;
}

/**
 * Mission creation data
 */
export interface MissionCreateData {
  week: number;
  day: number;
  content: string;
}

/**
 * Routine creation request
 */
export interface RoutineCreateRequest {
  theme: RoutineTheme;
}

/**
 * Routine creation response
 */
export interface RoutineCreateResponse {
  routineId: string;
}

/**
 * Routine data for learning room
 */
export interface RoutineData {
  id: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  progress: {
    currentWeek: number;
    currentDay: number;
    totalMissions: number;
    completedMissions: number;
    completionPercentage: number;
  };
  missions: Array<{
    id: string;
    week: number;
    day: number;
    content: string;
    aiFeedback: string | null;
    completed: boolean;
  }>;
  report?: {
    id: string;
    summary: string;
    scoreChange: number;
    createdAt: Date;
  } | null;
}
