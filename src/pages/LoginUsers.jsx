import Login from "../components/Login/Login";
import "@/components/Login/Login.css";

const LoginUsers = () => {
  return (
    <div className="container-fluid bg-light">
      <div className="row">
        {/* Columna izquierda con imagen */}
        <div className="col-lg-4 justify-content-center p-0">
          <img
            src="/src/assets/images/bg-login.webp"
            alt="Login ilustración"
            className="img-fluid w-75 h-100 object-fit-cover"
          />
        </div>

        {/* Columna derecha con login */}
        <div className="col-lg-7 d-flex align-items-center justify-content-center py-5">
          <Login />
        </div>
      </div>
    </div>

  );
};

export default LoginUsers;
