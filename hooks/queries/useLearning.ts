import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Routine, Mission } from "@prisma/client";

export const learningKeys = {
  all: ["learning"] as const,
  room: () => [...learningKeys.all, "room"] as const,
  routine: (id: string) => [...learningKeys.all, "routine", id] as const,
  missions: (routineId: string) => [...learningKeys.all, "missions", routineId] as const,
  report: (routineId: string) => [...learningKeys.all, "report", routineId] as const,
  dashboard: () => [...learningKeys.all, "dashboard"] as const,
};

interface LearningRoomData {
  routine: Routine | null;
  missions: Mission[];
  todayMission: Mission | null;
  progress: number;
  currentWeek: number;
  currentDay: number;
  upcomingSession?: {
    date: string;
    time: string;
    type: string;
  };
  feedbackSummary?: {
    grammar: string;
    pronunciation: string;
    fluency: string;
  };
}

export function useLearningRoom(enabled: boolean = true) {
  return useQuery({
    queryKey: learningKeys.room(),
    queryFn: async (): Promise<LearningRoomData> => {
      const response = await fetch("/api/learning-room/data");
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled, // Only fetch when authenticated
    retry: false, // Don't retry on error to prevent infinite loops
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: learningKeys.dashboard(),
    queryFn: async () => {
      const response = await fetch("/api/dashboard/data");
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { theme: string; level: string }) => {
      const response = await fetch("/api/routines/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: learningKeys.room() });
      queryClient.invalidateQueries({ queryKey: learningKeys.dashboard() });
    },
  });
}

export function useCompleteMission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { missionId: string; answer: string }) => {
      const response = await fetch(`/api/missions/${params.missionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: params.answer }),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: learningKeys.room() });
    },
  });
}
