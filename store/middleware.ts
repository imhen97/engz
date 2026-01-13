import { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Custom middleware for logging state changes in development
 */
export const loggerMiddleware = <T extends object>(
  config: StateCreator<T>,
  name?: string
): StateCreator<T> => {
  return (set, get, api) => {
    const configResult = config(
      (...args) => {
        if (process.env.NODE_ENV === "development") {
          const [partial, replace, action] = args;
          console.log(`[${name || "Store"}]`, action || "action", {
            previous: get(),
            update: partial,
          });
        }
        set(...args);
      },
      get,
      api
    );
    return configResult;
  };
};

/**
 * Persistence middleware factory
 * Creates a middleware that persists state to localStorage
 */
export const createPersistMiddleware = <T extends object>(
  key: string,
  whitelist?: (keyof T)[]
) => {
  return (config: StateCreator<T>): StateCreator<T> => {
    return (set, get, api) => {
      // Load initial state from localStorage
      let initialState: Partial<T> = {};
      
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (whitelist) {
              // Only restore whitelisted keys
              initialState = whitelist.reduce((acc, key) => {
                if (parsed[key] !== undefined) {
                  acc[key] = parsed[key];
                }
                return acc;
              }, {} as Partial<T>);
            } else {
              initialState = parsed;
            }
          }
        } catch (error) {
          console.error(`[PersistMiddleware] Failed to load state for ${key}:`, error);
        }
      }

      const configResult = config(
        (...args) => {
          set(...args);
          
          // Persist state after update
          if (typeof window !== "undefined") {
            try {
              const currentState = get();
              const stateToPersist = whitelist
                ? whitelist.reduce((acc, key) => {
                    acc[key] = currentState[key];
                    return acc;
                  }, {} as Partial<T>)
                : currentState;
              
              localStorage.setItem(key, JSON.stringify(stateToPersist));
            } catch (error) {
              console.error(`[PersistMiddleware] Failed to persist state for ${key}:`, error);
            }
          }
        },
        get,
        api
      );

      // Merge initial state with config result
      return {
        ...configResult,
        ...initialState,
      } as T;
    };
  };
};

/**
 * Combine multiple middlewares
 */
export const combineMiddlewares = <T extends object>(
  ...middlewares: Array<(config: StateCreator<T>) => StateCreator<T>>
) => {
  return (config: StateCreator<T>): StateCreator<T> => {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      config
    );
  };
};
