import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi, tokenStore, userStore } from "./api";
import type { UserPublic, Role } from "./types";

interface AuthState {
  user: UserPublic | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserPublic>;
  signup: (name: string, email: string, password: string) => Promise<UserPublic>;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<UserPublic, "name" | "email" | "avatar">>) => Promise<UserPublic>;
  hasRole: (r: Role) => boolean;
}

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(userStore.get());
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await authApi.login(email, password);
    tokenStore.set(token);
    userStore.set(user);
    setUser(user);
    return user;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { token, user } = await authApi.signup(name, email, password);
    tokenStore.set(token);
    userStore.set(user);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    userStore.clear();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (patch: Partial<Pick<UserPublic, "name" | "email" | "avatar">>) => {
    const updated = await authApi.updateProfile(patch);
    setUser(updated);
    return updated;
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      updateProfile,
      hasRole: (r) => user?.role === r,
    }),
    [user, loading, login, signup, logout, updateProfile],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
