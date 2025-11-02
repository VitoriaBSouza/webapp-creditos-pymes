import "./Navbar.css";
import { supabase } from "../../auth/supabaseClient";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../services/toastService";

export default function NavbarDashboard() {

  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      showSuccess("Sesión cerrada correctamente.");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      showError("Error al cerrar sesión: " + error.message);
    }
  };

  return (
    <header>
      <img src="/logo.svg" alt="Logo Fintech NC" onClick={goHome}/>
      <nav>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/user/profile">Mi Perfil</a></li>
          <li><a href="">Ayuda</a></li>
        </ul>
      </nav>
      <button onClick={handleLogout} className="btn btn-outline-danger me-4 fw-bold">Cerrar Sesión</button>
    </header>
  );
}
