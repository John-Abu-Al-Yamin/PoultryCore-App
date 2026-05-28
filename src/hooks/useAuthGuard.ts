import { useEffect, useState } from "react";
import { checkAuthToken, getUser } from "@/src/services/cookies";
import type { User } from "@/src/types";

interface AuthGuardState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  hasCompletedSetup: boolean;
}

export function useAuthGuard(): AuthGuardState {
  const [state, setState] = useState<AuthGuardState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    hasCompletedSetup: false,
  });

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const hasToken = await checkAuthToken();

        if (!hasToken) {
          if (mounted) {
            setState({
              isLoading: false,
              isAuthenticated: false,
              user: null,
              hasCompletedSetup: false,
            });
          }
          return;
        }

        const user = await getUser();
        if (mounted) {
          setState({
            isLoading: false,
            isAuthenticated: true,
            user,
            hasCompletedSetup: user?.has_completed_setup ?? false,
          });
        }
      } catch {
        if (mounted) {
          setState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            hasCompletedSetup: false,
          });
        }
      }
    };

    check();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
