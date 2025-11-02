import { useState } from "react";
import "./ProfileClient.css";

export const UserDetails = ({ user }) => {

    const [loading, setLoading] = useState(false);

    const [userData, setUserData] = useState({
        id: user.id || "",
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        role: user.role || "",
        password: "",
        updated_at: user.updated_at || ""
    })

    const [repeatPassword, setRepeatPassword] = useState("")

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (userData.password === repeatPassword) {

                //Hace copia de los datos del formulario
                const dataToSend = { ...userData };

                //Si no hay password no se envia
                if (!dataToSend.password.trim()) {
                    delete dataToSend.password;
                }
                const data = "need to add API service"

                if (data.ok) {
                    setRepeatPassword("");
                } else {
                    window.alert(data.error || "Perfil no actualizado, intente nuevamente.");
                }
            } else {
                window.alert("Contraseñas no son iguales. Intente nuevamente.");
            }

        } catch (error) {
            window.alert("Error al actulizar, por favor intente nuevamente.");
        }
    }

    return (
        <div className="container">
            <h2 className="py-4 text-center profile_form_title">Información Usuario</h2>
            {loading ? 
            (<p className="fs-5 text-center">
                    Cargando datos...
                </p>)
            :
            (<form
                className="p-5 border border-2 mx-auto rounded client_profile_form"
                onSubmit={handleSubmit}>

                <p className="lh-sm text-center fw-semibold text-info">Para cambiar los campos bloqueados pongase en contacto con nosotros.</p>

                <div className="mb-4">
                    <label htmlFor="user_name" className="form-label">
                        Nombre
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="user_name"
                        value={userData.first_name}
                        placeholder="Nombre"
                        aria-label="user_name"
                        onChange={handleChange}
                        disabled />
                </div>

                <div className="mb-4">
                    <label htmlFor="user_lastname" className="form-label">
                        Apellidos
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="user_lastname"
                        value={userData.last_name}
                        placeholder="Apellidos"
                        aria-label="user_lastname"
                        onChange={handleChange}
                        disabled />
                </div>

                <div className="mb-4 m-0 p-0">
                    <label htmlFor="user_email" className="form-label">
                        Correo electrónico
                    </label>
                    <input
                        className="form-control"
                        type="email"
                        id="user_email"
                        value={userData.email}
                        placeholder="usuario1@example.com"
                        aria-label="user_email"
                        onChange={handleChange} />
                </div>

                <div className="mb-3 m-0 p-0">
                    <label htmlFor="password" className="form-label">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        className="form-control"
                        id="user_password"
                        onChange={handleChange} />
                </div>
                <div className="mb-5">
                    <label htmlFor="repeatPassword1" className="form-label">
                        Confirmar contraseña
                    </label>
                    <input
                        type="password"
                        value={repeatPassword}
                        className="form-control"
                        id="user_repeatPassword"
                        onChange={(e) => setRepeatPassword(e.target.value)} />
                </div>

                <button type="submit"
                    className="rounded-2 border-0 p-2 w-75 d-flex mx-auto justify-content-center profile_form_submit_btn">
                    Guardar
                </button>
            </form>)}
        </div>
    );
}