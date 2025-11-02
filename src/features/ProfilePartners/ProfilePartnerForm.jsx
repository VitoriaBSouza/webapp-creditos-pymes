import { useState } from "react";

//CSS files
import "./PartnerProfile.css";

export const ProfilePartnerForm = ({ operator }) => {

    const [operatorData, setoperatorData] = useState({
        id: operator.id || "",
        email: operator.email || "",
        first_name: operator.name || "",
        last_name: operator.lastname || "",
        role: operator.role || "",
        password: "",
        updated_at: operator.updated_at || ""
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
            if (operatorData.password === repeatPassword) {

                //Hace copia de los datos del formulario
                const dataToSend = { ...operatorData };

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
            <form 
            className="p-5 border border-2 mx-auto rounded partner_profile_form"
            onSubmit={handleSubmit}>

                <div className="mb-4">
                    <label htmlFor="operator_name" className="form-label">
                        Nombre
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="operator_name"
                        name="first_name"
                        value={operator?.first_name}
                        placeholder="Nombre"
                        aria-label="operator_name" 
                        onChange={handleChange}/>
                </div>

                <div className="mb-4">
                    <label htmlFor="operator_lastname" className="form-label">
                        Apellidos
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="operator_lastname"
                        name="last_name"
                        value={operator?.last_name}
                        placeholder="Apellidos"
                        aria-label="operator_lastname" 
                        onChange={handleChange}/>
                </div>

                <div className="mb-4 m-0">
                    <label htmlFor="operator_email" className="form-label">
                        Correo electrónico
                    </label>
                    <input
                        className="form-control"
                        type="email"
                        id="operator_email"
                        name="email"
                        value={operator?.email}
                        placeholder="usuario1@example.com"
                        aria-label="operator_email" 
                        onChange={handleChange}/>
                </div>

                <div className="mb-3 m-0">
                    <label htmlFor="operator_password" className="form-label">
                        Contraseña
                    </label>
                    <input 
                    type="password" 
                    className="form-control" 
                    name="password"
                    value={operatorData.password}
                    id="operator_password" 
                    onChange={handleChange}/>
                </div>
                <div className="mb-5">
                    <label htmlFor="repeatPassword1" className="form-label">
                        Confirmar contraseña
                    </label>
                    <input 
                    type="password"
                    value={repeatPassword}
                    className="form-control" 
                    id="repeatPassword1" 
                    onChange={(e) => setRepeatPassword(e.target.value)}/>
                </div>

                <button type="submit"
                    className="btn p-2 w-75 d-flex mx-auto justify-content-center partner_form_submit_btn">
                    Guardar
                </button>
            </form>
        </div>
    );
}