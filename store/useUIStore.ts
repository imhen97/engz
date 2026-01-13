import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type ModalType = "login" | "signup" | "feedback" | "confirm" | null;
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface UIState {
  // Modal state
  activeModal: ModalType;
  modalData: Record<string, unknown>;
  
  // Toast state
  toasts: Toast[];
  
  // Sidebar state (for admin)
  isSidebarOpen: boolean;
  
  // Loading states
  globalLoading: boolean;
  loadingMessage: string;
  
  // Actions
  openModal: (modal: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  toggleSidebar: () => void;
  setGlobalLoading: (loading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      activeModal: null,
      modalData: {},
      toasts: [],
      isSidebarOpen: true,
      globalLoading: false,
      loadingMessage: "",

      openModal: (modal, data = {}) =>
        set({ activeModal: modal, modalData: data }, false, "openModal"),

      closeModal: () =>
        set({ activeModal: null, modalData: {} }, false, "closeModal"),

      showToast: (type, message, duration = 5000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        set(
          (state) => ({
            toasts: [...state.toasts, { id, type, message, duration }],
          }),
          false,
          "showToast"
        );
        
        if (duration > 0) {
          setTimeout(() => get().removeToast(id), duration);
        }
      },

      removeToast: (id) =>
        set(
          (state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }),
          false,
          "removeToast"
        ),

      toggleSidebar: () =>
        set(
          (state) => ({ isSidebarOpen: !state.isSidebarOpen }),
          false,
          "toggleSidebar"
        ),

      setGlobalLoading: (loading, message = "") =>
        set(
          { globalLoading: loading, loadingMessage: message },
          false,
          "setGlobalLoading"
        ),
    }),
    { name: "UIStore" }
  )
);
