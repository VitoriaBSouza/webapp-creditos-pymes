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
      navigate("/");
    } else if (user.role === "applicant") {
      navigate("/dashboard");
    } else {
      navigate("/dashboard-partner");
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      sessionStorage.clear();
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

    if (!user?.role) return; // safety check

    const routes = {
      dashboard: {
        applicant: "/dashboard",
        operator: "/partner-dashboard",
      },
      profile: {
        applicant: "/user/profile",
        operator: "/partner/profile",
      },
    };

    const path = routes[tab]?.[user.role];
    if (path) navigate(path);
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