import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Routine, Mission } from "@prisma/client";

interface LearningState {
  // Current routine state
  currentRoutine: Routine | null;
  missions: Mission[];
  todayMission: Mission | null;
  completedMissions: string[];
  
  // Progress tracking
  weekProgress: number[];
  streakCount: number;
  lastActiveDate: string | null;
  
  // UI state
  isLoadingRoutine: boolean;
  isSubmittingMission: boolean;
  
  // Actions
  setCurrentRoutine: (routine: Routine | null) => void;
  setMissions: (missions: Mission[]) => void;
  setTodayMission: (mission: Mission | null) => void;
  completeMission: (missionId: string) => void;
  updateWeekProgress: (progress: number[]) => void;
  updateStreak: () => void;
  setLoading: (key: "routine" | "mission", value: boolean) => void;
  resetLearning: () => void;
}

export const useLearningStore = create<LearningState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentRoutine: null,
        missions: [],
        todayMission: null,
        completedMissions: [],
        weekProgress: [0, 0, 0, 0],
        streakCount: 0,
        lastActiveDate: null,
        isLoadingRoutine: false,
        isSubmittingMission: false,

        setCurrentRoutine: (routine) =>
          set({ currentRoutine: routine }, false, "setCurrentRoutine"),

        setMissions: (missions) =>
          set({ missions }, false, "setMissions"),

        setTodayMission: (mission) =>
          set({ todayMission: mission }, false, "setTodayMission"),

        completeMission: (missionId) =>
          set(
            (state) => ({
              completedMissions: [...state.completedMissions, missionId],
              todayMission: state.todayMission?.id === missionId
                ? { ...state.todayMission, completed: true }
                : state.todayMission,
            }),
            false,
            "completeMission"
          ),

        updateWeekProgress: (progress) =>
          set({ weekProgress: progress }, false, "updateWeekProgress"),

        updateStreak: () => {
          const today = new Date().toISOString().split("T")[0];
          const { lastActiveDate, streakCount } = get();
          
          if (lastActiveDate === today) return;
          
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];
          
          set(
            {
              streakCount: lastActiveDate === yesterdayStr ? streakCount + 1 : 1,
              lastActiveDate: today,
            },
            false,
            "updateStreak"
          );
        },

        setLoading: (key, value) =>
          set(
            key === "routine"
              ? { isLoadingRoutine: value }
              : { isSubmittingMission: value },
            false,
            "setLoading"
          ),

        resetLearning: () =>
          set(
            {
              currentRoutine: null,
              missions: [],
              todayMission: null,
              completedMissions: [],
            },
            false,
            "resetLearning"
          ),
      }),
      {
        name: "learning-storage",
        partialize: (state) => ({
          streakCount: state.streakCount,
          lastActiveDate: state.lastActiveDate,
          completedMissions: state.completedMissions,
        }),
      }
    ),
    { name: "LearningStore" }
  )
);
