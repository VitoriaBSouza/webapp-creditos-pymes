import { useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS files
import "../features/SignIn/SignIn.css";

//services
import { supabase } from "../auth/supabaseClient";
import { showError, showSuccess } from "../services/toastService";

//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-regular-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'

const SignInPage = () => {
    const [showSecondForm, setShowSecondForm] = useState(false);
    const navigate = useNavigate();
    const [activeIcon, setActiveIcon] = useState("company");

    const handleNext = () => {
        setActiveIcon("user");
        setShowSecondForm(true);
    }

    const [formData, setFormData] = useState({
        company: "",
        tax_id: "",
        contact_phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            zip_code: "",
            country: ""
        },
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmarPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const field = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSiguiente = (e) => {
        e.preventDefault();
        setShowSecondForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmarPassword) {
            showError("Las contraseñas no coinciden");
            return;
        }

        try {
            console.log(formData);

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        company: {
                            legal_name: formData.company,
                            tax_id: formData.tax_id,
                            contact_email: formData.email,
                            contact_phone: formData.contact_phone,
                            address: formData.address
                        }
                    },
                },
            });

            if (error) {
                showError(error.message);
                return;
            }

            showSuccess("Usuario registrado exitosamente.");
            console.log("Usuario registrado:", data);

            setTimeout(() => {
                navigate("/login-users");
            }, 1000);

        } catch (err) {
            console.error("Error inesperado:", err);
            showError("Ocurrió un error al registrar el usuario.");
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-4 justify-content-center p-0">
                    <img
                        src="/src/assets/images/bg-login.webp"
                        alt="Login ilustración"
                        className="img-fluid w-100 h-100 object-fit-cover"
                    />
                </div>
                <div className="col-lg-7 mt-5 mx-auto pb-5">
                    <div className="d-flex text-center mt-5 mx-auto justify-content-center">
                        <div className={`bg-white border-0 mt-3 icons_profile_page me-3 ${activeIcon === "company" ? "signup_page_form" : ""}`}>
                            <FontAwesomeIcon
                                icon={faHouse}
                                className="fs-1"
                            />
                        </div>

                        <div className={`bg-white border-0 icons_profile_page fs-1 ${activeIcon === "user" ? "signup_page_form" : ""}`}>
                            <FontAwesomeIcon
                                icon={faUser}
                                className="fs-1" />
                        </div>
                    </div>
                    <div className="container w-75 d-flex align-items-center justify-content-center">

                        <form onSubmit={!showSecondForm ? handleSiguiente : handleSubmit}
                            className="border rounded mt-3 w-100 p-5">
                            {!showSecondForm ? (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre de la Empresa</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between gap-2 mb-3">
                                        <div className="flex-fill me-2">
                                            <label className="form-label">Identificador Fiscal</label>
                                            <input
                                                type="text"
                                                name="tax_id"
                                                value={formData.tax_id}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="flex-fill me-2">
                                            <label className="form-label">Teléfono</label>
                                            <input
                                                type="text"
                                                name="contact_phone"
                                                value={formData.contact_phone}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3 m-0 p-0">
                                        <label className="form-label">Dirección</label>
                                        <input
                                            type="text"
                                            name="address.street"
                                            value={formData?.address?.street}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between gap-2 mb-3 m-0">
                                        <div className="flex-fill me-2">
                                            <label className="form-label">Ciudad</label>
                                            <input
                                                type="text"
                                                name="address.city"
                                                value={formData?.address?.city}
                                                onChange={handleChange}
                                                className="form-control"
                                                style={{ width: "95%" }}
                                                required
                                            />
                                        </div>
                                        <div className="flex-fill">
                                            <label className="form-label">Estado / Provincia</label>
                                            <input
                                                type="text"
                                                name="address.state"
                                                value={formData.address.state}
                                                onChange={handleChange}
                                                className="form-control"
                                                style={{ width: "95%" }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between gap-2 mb-3 m-0">
                                        <div className="flex-fill">
                                            <label className="form-label">Código Postal</label>
                                            <input
                                                type="text"
                                                name="address.zip_code"
                                                value={formData.address.zip_code}
                                                onChange={handleChange}
                                                className="form-control"
                                                style={{ width: "95%" }}
                                                required
                                            />
                                        </div>
                                        <div className="flex-fill">
                                            <label className="form-label">País</label>
                                            <input
                                                type="text"
                                                name="address.country"
                                                value={formData.address.country}
                                                onChange={handleChange}
                                                className="form-control"
                                                style={{ width: "95%" }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="border rounded color-btn w-50 d-flex mx-auto justify-content-center mt-4"
                                        onClick={handleNext}>
                                        Siguiente
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Apellidos</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3 m-0">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3 m-0">
                                        <label className="form-label">Contraseña</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            name="confirmarPassword"
                                            value={formData.confirmarPassword}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-check mb-3">
                                        <input className="form-check-input" type="checkbox" id="checkDefault" required />
                                        <label className="form-check-label" htmlFor="checkDefault">
                                            Acepto los{" "}
                                            <a href="#" className="terminosycondiciones">términos y condiciones</a>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="border rounded color-btn w-50 d-flex mx-auto justify-content-center mt-4">
                                        Registrarse
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;