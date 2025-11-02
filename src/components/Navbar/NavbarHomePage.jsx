import { useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS files
import "./Navbar.css";

export default function NavbarHomePage() {
  const [activeTab, setActiveTab] = useState("empresas");
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

  const handleTabs = (tab) => {
    setActiveTab(tab);
  };

  return (
    <header>
      <img src="/logo.svg" alt="Logo Fintech NC" onClick={goHome} />
      <nav>
        <ul className="navbar_tabs_items">
          <li>
            <a
              href="/"
              className={activeTab === "empresas" ? "active" : ""}
              onClick={() => handleTabs("empresas")}
            >
              Empresas
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeTab === "partners" ? "active" : ""}
              onClick={() => handleTabs("partners")}
            >
              Partners
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeTab === "nosotros" ? "active" : ""}
              onClick={() => handleTabs("nosotros")}
            >
              Sobre Nosotros
            </a>
          </li>
        </ul>
      </nav>
      <a href="#">Soporte</a>
    </header>
  );
}
