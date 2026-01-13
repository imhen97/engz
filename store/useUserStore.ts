import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { UserSession, UserRole, SubscriptionPlan } from "@/types/user";

interface UserState {
  // State
  user: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: UserSession | null) => void;
  updateUserRole: (role: UserRole) => void;
  updateUserPlan: (plan: SubscriptionPlan) => void;
  updateTrialStatus: (trialActive: boolean, trialEndsAt: Date | null) => void;
  updateSubscriptionStatus: (subscriptionActive: boolean) => void;
  clearUser: () => void;
}

const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      ...initialState,

      setUser: (user) =>
        set(
          {
            user,
            isAuthenticated: !!user,
            isLoading: false,
          },
          false,
          "setUser"
        ),

      updateUserRole: (role) =>
        set(
          (state) => ({
            user: state.user ? { ...state.user, role } : null,
          }),
          false,
          "updateUserRole"
        ),

      updateUserPlan: (plan) =>
        set(
          (state) => ({
            user: state.user ? { ...state.user, plan } : null,
          }),
          false,
          "updateUserPlan"
        ),

      updateTrialStatus: (trialActive, trialEndsAt) =>
        set(
          (state) => ({
            user: state.user
              ? { ...state.user, trialActive, trialEndsAt }
              : null,
          }),
          false,
          "updateTrialStatus"
        ),

      updateSubscriptionStatus: (subscriptionActive) =>
        set(
          (state) => ({
            user: state.user
              ? { ...state.user, subscriptionActive }
              : null,
          }),
          false,
          "updateSubscriptionStatus"
        ),

      clearUser: () =>
        set(initialState, false, "clearUser"),
    }),
    { name: "UserStore" }
  )
);
