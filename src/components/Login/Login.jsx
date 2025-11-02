import "./Login.css";
import Button from "../Button/Button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ButtonActions } from "../Button/ButtonActions";
import { showError } from "../../services/toastService";

const Login = ({ isPartner = false }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [load, setLoad] = useState(false)
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoad(true);
        try {
            await ButtonActions.login(navigate, email, password, isPartner);
        } catch (error) {
            console.error(error);
            showError("Error de acceso: ", error)
        } finally {
            setLoad(false);
        }
    };


    return (
        <div className="login-card shadow p-4 rounded bg-white">
            <div className="text-center mb-4">
                <div className="user-icon mx-auto mb-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="user-svg"
                    >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                </div>
                <h4 className="mt-2">Iniciar Sesión</h4>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Usuario</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="d-flex align-self-center justify-content-center my-4 m-0">
                    <Link className="forgot-link" to="/reset-password"> ¿Olvidó su contraseña?</Link>
                </div>

                <Button
                    text={load ? "Iniciando sesión..." : "Iniciar Sesión"}
                    color="teal"
                    size="md"
                    className="w-100 mb-2"
                    action={handleLogin}
                />
                {!isPartner && (
                    <Button
                        text="Crear una cuenta"
                        color="default"
                        size="md"
                        className="w-100"
                        action="register"
                    />
                )}
            </form>
        </div>
    );
};

export default Login;
