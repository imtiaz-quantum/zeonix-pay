"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user ?? null;
  const role = (session?.user as any)?.role ?? null;

  return {
    session,
    user,
    role,
    status, // "loading" | "authenticated" | "unauthenticated"
    isAuthenticated: status === "authenticated",
  };
}
