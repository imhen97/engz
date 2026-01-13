import { useState, useCallback } from "react";
import { useUIStore } from "@/store";

interface UseApiCallOptions {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

interface ApiCallState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useApiCall<T = unknown>(options: UseApiCallOptions = {}) {
  const { showErrorToast = true, showSuccessToast = false, successMessage } = options;
  const { showToast } = useUIStore();
  
  const [state, setState] = useState<ApiCallState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (
      apiCall: () => Promise<Response>,
      onSuccess?: (data: T) => void,
      onError?: (error: string) => void
    ) => {
      setState({ data: null, error: null, isLoading: true });

      try {
        const response = await apiCall();
        const json = await response.json();

        if (!response.ok || !json.success) {
          const errorMessage = json.error || "요청 처리 중 오류가 발생했습니다";
          setState({ data: null, error: errorMessage, isLoading: false });
          
          if (showErrorToast) {
            showToast("error", errorMessage);
          }
          
          onError?.(errorMessage);
          return null;
        }

        setState({ data: json.data, error: null, isLoading: false });
        
        if (showSuccessToast && successMessage) {
          showToast("success", successMessage);
        }
        
        onSuccess?.(json.data);
        return json.data as T;
      } catch (error) {
        const errorMessage = "네트워크 오류가 발생했습니다";
        setState({ data: null, error: errorMessage, isLoading: false });
        
        if (showErrorToast) {
          showToast("error", errorMessage);
        }
        
        onError?.(errorMessage);
        return null;
      }
    },
    [showErrorToast, showSuccessToast, successMessage, showToast]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Usage example:
// const { data, error, isLoading, execute } = useApiCall<UserData>({
//   showSuccessToast: true,
//   successMessage: "저장되었습니다",
// });
//
// const handleSubmit = async () => {
//   await execute(
//     () => fetch("/api/user", { method: "POST", body: JSON.stringify(data) }),
//     (userData) => console.log("Success:", userData),
//     (error) => console.log("Error:", error)
//   );
// };
