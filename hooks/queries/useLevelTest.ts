import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Question, TestResult, LevelTestSubmission } from "@/types/leveltest";

// Query keys
export const levelTestKeys = {
  all: ["levelTest"] as const,
  questions: (section: string) => [...levelTestKeys.all, "questions", section] as const,
  result: (id: string) => [...levelTestKeys.all, "result", id] as const,
  latestResult: () => [...levelTestKeys.all, "result", "latest"] as const,
};

// Fetch questions
export function useTestQuestions(section: string, enabled = true) {
  return useQuery({
    queryKey: levelTestKeys.questions(section),
    queryFn: async (): Promise<Question[]> => {
      const response = await fetch(`/api/leveltest/questions?section=${section}`);
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    enabled,
    staleTime: 1000 * 60 * 10, // Questions don't change often
  });
}

// Submit test
export function useSubmitTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission: LevelTestSubmission): Promise<TestResult> => {
      const response = await fetch("/api/leveltest/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch latest result
      queryClient.invalidateQueries({ queryKey: levelTestKeys.latestResult() });
    },
  });
}

// Get latest result
export function useLatestTestResult() {
  return useQuery({
    queryKey: levelTestKeys.latestResult(),
    queryFn: async (): Promise<TestResult | null> => {
      const response = await fetch("/api/leveltest/result/latest");
      const json = await response.json();
      if (!json.success) return null;
      return json.data;
    },
  });
}

// Get specific result
export function useTestResult(id: string, enabled = true) {
  return useQuery({
    queryKey: levelTestKeys.result(id),
    queryFn: async (): Promise<TestResult> => {
      const response = await fetch(`/api/leveltest/result/${id}`);
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    enabled: enabled && !!id,
  });
}

// Grade writing
export function useGradeWriting() {
  return useMutation({
    mutationFn: async (answers: { questionId: string; answer: string }[]) => {
      const response = await fetch("/api/leveltest/grade-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
  });
}
