"use client";

import type { User } from "@/lib/db/schema";
import { useEffect, useState } from "react";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * React hook that provides the current authentication state of the user.
 *
 * Fetches session data from the server on mount to determine if a user is authenticated, returning user information, loading status, and authentication status.
 * 
 * @returns The current authentication state, including user info, loading status, and authentication status.
 */
export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/session", {
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setAuthState({
            user: data.user,
            isLoading: false,
            isAuthenticated: !!data.user,
          });
        } else {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
}

/**
 * Logs out the current user by sending a logout request and redirects to the home page.
 *
 * Ends the user session on the server and forces a full page reload to update authentication state.
 */
export async function logout() {
  try {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    // Force page refresh to update auth state
    window.location.href = "/";
  } catch (error) {
    console.error("Logout error:", error);
  }
}
