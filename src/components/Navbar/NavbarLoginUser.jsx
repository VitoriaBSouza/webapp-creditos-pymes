import "./Navbar.css";
import { useNavigate } from "react-router-dom";

export default function NavbarLoginUser() {
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/");
  };
  return (
    <header>
      <img src="/logo.svg" alt="Logo Fintech NC" onClick={goHome}/>
      <nav>
        <ul>
          <li><a href="">Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
}
