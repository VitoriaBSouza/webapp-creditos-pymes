import { supabase } from "./supabaseClient";

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error };

  const { user, session } = data;
  return { user, session };
};

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
};

export const setAppRole = (role) => {
  localStorage.setItem("app-role", role);
};

export const forgotPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error };
};

export const resetPassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  // force refresh session after update
  if (!error) {
    await supabase.auth.refreshSession();
  }

  return { data, error };
};