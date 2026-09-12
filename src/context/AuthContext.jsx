import * as React from "react";
import { supabase } from "../lib/supabaseClient";

// ---------------------------------------------------------------------------
// Real auth, backed by Supabase. The admin dashboard is gated by a Supabase
// Auth user you create yourself (Authentication -> Users -> Add user in the
// Supabase dashboard) — there's no signup flow here on purpose, since this
// site only ever needs one admin.
// ---------------------------------------------------------------------------

const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = React.useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  }, []);

  const logout = React.useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const changePassword = React.useCallback(async (currentPassword, newPassword) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return false;

    // Re-confirm the current password before allowing the change, since
    // Supabase's updateUser() doesn't ask for it itself (the user is
    // already authenticated by session).
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (reauthError) return false;

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return !error;
  }, []);

  const value = React.useMemo(
    () => ({
      isAuthenticated: !!session,
      authLoading,
      userEmail: session?.user?.email ?? "",
      login,
      logout,
      changePassword,
    }),
    [session, authLoading, login, logout, changePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}