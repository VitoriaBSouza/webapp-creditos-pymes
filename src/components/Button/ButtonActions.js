import { loginUser } from "../../auth/authService";
import { supabase } from "../../auth/supabaseClient";
import { showError, showSuccess } from "../../services/toastService";
import userServices from "../../services/userServices";

export const ButtonActions = {
  goHome: (navigate) => navigate("/"),
  loginUser: (navigate) => navigate("/login-users"),
  loginPartner: (navigate) => navigate("/login-partners"),
  register: (navigate) => navigate("/sign-up"),
  alert: () => alert("Ha habido un problema, por favor intente nuevamnete."),

  login: async (navigate, email, password, isPartner = false) => {
    if (!email || !password) {
      showError("Por favor complete usuario y contraseña");
      return;
    }

    // Iniciar sesión
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return showError(error.message || "Error al iniciar sesión.");

    const session = data.session;
    console.log(session);
    
    // Store session
    localStorage.setItem("session", JSON.stringify(session));
    navigate(isPartner ? "/partner-dashboard" : "/dashboard");
    showSuccess("Login correcto");

  }
}