import { useCallback, useMemo } from "react";
import { trpc } from "@/providers/trpc";

export interface AuthUser {
  id: number;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: "user" | "admin";
  authMethod?: string;
}

export function useAuth() {
  const utils = trpc.useUtils();
  const { data: oauthUser, isLoading: oauthLoading } = trpc.auth.me.useQuery(
    undefined,
    { retry: false, refetchOnWindowFocus: false },
  );

  // Determine the user from whichever auth method is active
  const user: AuthUser | null = useMemo(() => {
    if (oauthUser) {
      return {
        id: oauthUser.id,
        name: oauthUser.name,
        email: oauthUser.email,
        avatar: oauthUser.avatar,
        role: oauthUser.role as "user" | "admin",
        authMethod: oauthUser.authMethod ?? "oauth",
      };
    }
    return null;
  }, [oauthUser]);

  const isLoading = oauthLoading;
  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      utils.invalidate();
      window.location.reload();
    },
  });

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    logoutMutation.mutate();
    window.location.reload();
  }, [logoutMutation]);

  return {
    user,
    isLoading,
    isLoggedIn,
    isAdmin,
    logout,
  };
}
