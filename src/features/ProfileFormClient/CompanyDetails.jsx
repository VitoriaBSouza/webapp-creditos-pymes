
import { useEffect, useState } from "react";

// CSS files
import "./ProfileClient.css";

// other services
import companyServices from "../../services/companyServices.js";
import { showError, showSuccess } from "../../services/toastService.jsx";

export const CompanyDetails = () => {

    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState(null);

    const [formCompany, setFormCompany] = useState({
        id: "",
        user_id: "",
        legal_name: "",
        tax_id: "",
        contact_email: "",
        contact_phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            zip_code: "",
            country: ""
        },
        created_at: "",
        updated_at: ""
    });

    const handleChange = e => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const key = name.split(".")[1];
            setFormCompany({
                ...formCompany,
                address: {
                    ...formCompany.address,
                    [key]: value
                }
            });
        } else {
            setFormCompany({
                ...formCompany,
                [name]: value
            });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formCompany.contact_email.trim()) {

                // Solo enviamos email/phone, address se mantiene igual
                const dataToSend = {
                    contact_email: formCompany.contact_email,
                    contact_phone: formCompany.contact_phone,
                    address: { ...formCompany.address } // dirección tal como está
                };

                const updatedCompany = await companyServices.updateCompanyContact(dataToSend);

                if (updatedCompany) {
                    setFormCompany(prev => ({
                        ...prev,
                        contact_email: updatedCompany.contact_email,
                        contact_phone: updatedCompany.contact_phone
                        // address no se toca
                    }));

                    sessionStorage.setItem("my-company", JSON.stringify({
                        ...updatedCompany,
                        contact_email: updatedCompany.contact_email,
                        contact_phone: updatedCompany.contact_phone
                    }));

                    setLoading(false);
                    showSuccess("Datos de contacto de empresa actualizado.");
                } else {
                    setLoading(false);
                    showError("No se pudo actualizar la empresa.");
                }
            }

        } catch (error) {
            showError("Ocurrió un error inesperado. Inténtalo de nuevo.");
            console.error(error);
        } finally {
            // Quitar el focus del botón
            e.target.querySelector("button[type='submit']").blur();
        }
    };

    useEffect(() => {
        const companyDetails = async () => {
            try {
                if (!company?.id) {
                    setLoading(true);

                    const companyData = await companyServices.getMyCompanyDetails();
                    if (companyData) {
                        sessionStorage.setItem("my-company", JSON.stringify(companyData));
                        setCompany(companyData);
                        setFormCompany(companyData);
                    }
                }
            } catch (err) {
                console.error("Error al inicializar información de la empresa:", err);
                showError("Error al cargar datos de la empresa");
            } finally {
                setLoading(false);
            }
        };

        companyDetails();
    }, []);

    return (
        <div className="container">
            <h2 className="py-4 text-center profile_form_title">Información Empresa</h2>
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
                        <label htmlFor="companyName" className="form-label">
                            Nombre de la empresa
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="companyName"
                            name="legal_name"
                            value={formCompany.legal_name}
                            aria-label="Disabled input companyName"
                            disabled />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="companyIdNumber" className="form-label">
                            Identificador fiscal de la empresa
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            id="companyIdNumber"
                            name="tax_id"
                            value={formCompany.tax_id}
                            aria-label="Disabled input companyIdNumber"
                            disabled />
                    </div>

                    <div className="mb-4 m-0 p-0">
                        <label htmlFor="companyPhoneNumber" className="form-label">
                            Teléfono de la empresa
                        </label>
                        <input
                            className="form-control"
                            type="tel"
                            id="companyPhoneNumber"
                            name="contact_phone"
                            value={formCompany.contact_phone || ""}
                            aria-label="companyPhoneNumber"
                            onChange={handleChange} />
                    </div>

                    <div className="mb-4 m-0 p-0">
                        <label htmlFor="companyEmail" className="form-label">
                            Email de la empresa
                        </label>
                        <input
                            className="form-control"
                            type="email"
                            id="companyEmail"
                            name="contact_email"
                            value={formCompany.contact_email || ""}
                            aria-label="companyEmail"
                            onChange={handleChange} />
                    </div>

                    <div className="mb-3 m-0 p-0">
                        <label className="form-label">Dirección</label>
                        <input
                            type="text"
                            name="address.street"
                            value={formCompany?.address?.street}
                            onChange={handleChange}
                            className="form-control"
                            disabled
                        />
                    </div>

                    <div className="d-flex justify-content-between gap-2 mb-3 m-0">
                        <div className="flex-fill me-2">
                            <label className="form-label">Ciudad</label>
                            <input
                                type="text"
                                name="address.city"
                                value={formCompany?.address?.city}
                                onChange={handleChange}
                                className="form-control"
                                style={{ width: "95%" }}
                                disabled
                            />
                        </div>
                        <div className="flex-fill">
                            <label className="form-label">Estado / Provincia</label>
                            <input
                                type="text"
                                name="address.state"
                                value={formCompany.address.state}
                                onChange={handleChange}
                                className="form-control"
                                style={{ width: "95%" }}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-between gap-2 mb-3 m-0">
                        <div className="flex-fill">
                            <label className="form-label">Código Postal</label>
                            <input
                                type="text"
                                name="address.zip_code"
                                value={formCompany.address.zip_code}
                                onChange={handleChange}
                                className="form-control"
                                style={{ width: "95%" }}
                                disabled
                            />
                        </div>
                        <div className="flex-fill mb-4">
                            <label className="form-label">País</label>
                            <input
                                type="text"
                                name="address.country"
                                value={formCompany.address.country}
                                onChange={handleChange}
                                className="form-control"
                                style={{ width: "95%" }}
                                disabled
                            />
                        </div>
                    </div>

                    <button type="submit"
                        className="rounded-2 p-2 w-75 d-flex mx-auto justify-content-center border-0 profile_form_submit_btn">
                        Guardar
                    </button>
                </form>)}
        </div>
    );
}