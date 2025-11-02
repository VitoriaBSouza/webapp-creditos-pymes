import { useState } from "react";
import "./Navbar.css";
import { supabase } from "../../auth/supabaseClient";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../services/toastService";

export default function NavbarDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem("user")));

  const goHome = () => {
    if (!user?.id) {
      navigate("/"); // public home
    } else if (user.role === "applicant") {
      navigate("/dashboard"); // applicant dashboard
    } else {
      navigate("/dashboard-partner"); // partner dashboard
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all sessionStorage data
      sessionStorage.clear();

      // Optional: also clear localStorage if used
      localStorage.clear();

      showSuccess("Sesión cerrada correctamente.");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      showError("Error al cerrar sesión: " + error.message);
    }
  };

  const handleTabs = (tab) => {
    setActiveTab(tab);
    if(tab === "dashboard" && user.role === "applicant"){
      navigate("/dashboard");
    }else if(tab === "dashboard" && user.role === "operator"){
      navigate("/partner-dashboard")
    }else if(tab === "profile" && user?.role === "applicant"){
      navigate( "/user/profile")
    }else if(tab === "profile" && user?.role === "operator"){
      navigate("/partner/profile")
    }else{
      navigate("/#")
    }
  };

  return (
    <header>
      <img src="/logo.svg" alt="Logo Fintech NC" onClick={goHome} />
      <nav>
        <ul className="navbar_tabs_items">
          <li>
            <a
              href="#"
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => handleTabs("dashboard")}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => handleTabs("profile")}
            >
              Mi Perfil
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeTab === "help" ? "active" : ""}
              onClick={() => handleTabs("help")}
            >
              Ayuda
            </a>
          </li>
        </ul>
      </nav>
      <button onClick={handleLogout} className="btn btn-outline-danger me-4 fw-bold">
        Cerrar Sesión
      </button>
    </header>
  );
}