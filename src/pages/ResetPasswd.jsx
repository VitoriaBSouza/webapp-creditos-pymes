import { useState } from "react";

//services
import { showError, showSuccess } from "../services/toastService";
import { resetPassword } from "../auth/authService";
import { useNavigate } from "react-router-dom";

export default function ResetPasswd() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await resetPassword(password);
        if (error) showError(error.message);
        else{
            showSuccess("Contraseña actualizada correctamente");
            navigate("/login-users")
        };
    };

    return (
        <div className="container-fluid bg-light p-5">

            <form 
            onSubmit={handleSubmit} 
            className="mx-auto w-50 p-5 border rounded border-2 bg-white">
               <div className="mb-3">
                    <label htmlFor="reset_password" className="form-label fw-bold">
                        Nueva Contraseña
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="reset_password"
                        placeholder="*********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success mt-2 d-flex ms-auto">Cambiar contraseña</button>
            </form>
        </div>
    );
}
