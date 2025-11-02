import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, 
    autoRefreshToken: true, 
    detectSessionInUrl: true,
  },
});

//Escuchar cambios de sesión (login / refresh / logout)
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    localStorage.setItem("sb-session", JSON.stringify(session));
  } else {
    localStorage.removeItem("sb-session");
    sessionStorage.removeItem("user");
  }
});

