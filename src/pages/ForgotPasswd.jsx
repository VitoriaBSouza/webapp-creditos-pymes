import { useState } from "react";
import { forgotPassword } from "../auth/authService";
import { showError, showSuccess } from "../services/toastService";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await forgotPassword(email);
        if (error) showError(error.message);
        else showSuccess("Revisa tu correo para restablecer tu contraseña");
    };

    return (

        <div className="container-fluid bg-light p-5">

            <form
                onSubmit={handleSubmit}
                className="mx-auto w-50 p-5 border rounded border-2 bg-white">
                <div className="mb-3">
                    <label htmlFor="reset_password" className="form-label fw-bold">
                        Introduzca su email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="reset_password"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success mt-2 d-flex ms-auto">Recuperar contraseña</button>
            </form>
        </div>
    );
}