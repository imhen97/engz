import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  subscription: () => [...userKeys.all, "subscription"] as const,
};

export function useUserProfile() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const response = await fetch("/api/user/profile");
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    enabled: !!session?.user,
  });
}

export function useSubscription() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: userKeys.subscription(),
    queryFn: async () => {
      const response = await fetch("/api/user/subscription");
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    enabled: !!session?.user,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name?: string; image?: string }) => {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}
