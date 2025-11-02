import Login from "../components/Login/Login";
import "@/components/Login/Login.css";

export const LoginPartners = () => {

  return (
    <div className="d-flex flex-column login-root">
      <div className="container-fluid">
        <div className="row">
          {/* Columna izquierda con imagen */}
          <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-light p-0">
            <img
              src="/src/assets/images/login2.webp"
              alt="Login ilustración"
              className="img-fluid w-100 h-100 object-fit-cover"
            />
          </div>

          {/* Columna derecha con login */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center">
            <Login isPartner={true} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-custom">
        <p className="mb-0">&copy; 2025 Todos los derechos reservados</p>
      </footer>
    </div>
  );
}