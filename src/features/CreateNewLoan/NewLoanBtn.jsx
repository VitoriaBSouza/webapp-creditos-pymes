import { useState } from "react";

//CSS files
import "./NewLoanBtn.css";

//services
import { createNewLoan } from "../../services/creditService";
import documentServices, { DocumentTypes } from "../../services/documentServices";
import { showError, showSuccess } from "../../services/toastService";

export const NewLoanBtn = ({ company, onSuccess }) => {

    const [newLoanForm, setNewLoan] = useState({
        requested_amount: "",
        term_months: "",
        purpose: "",
        purpose_other: ""
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!newLoanForm.requested_amount || newLoanForm.requested_amount <= 0) {
            newErrors.requested_amount = "Ingrese un monto válido mayor que 0";
        }
        if (!newLoanForm.term_months || newLoanForm.term_months < 1) {
            newErrors.term_months = "Ingrese un plazo mínimo de 1 mes";
        }
        if (!newLoanForm.purpose) {
            newErrors.purpose = "Seleccione la finalidad del préstamo";
        }
        if (newLoanForm.purpose === "other" && !newLoanForm.purpose_other.trim()) {
            newErrors.purpose_other = "Debe especificar el propósito si eligió 'Otro'";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const minMonths = 1;
    const maxMonths = 360;

    const loanReason = [
        { label: "Elige una opción", value: "" },
        { label: "Capital de trabajo", value: "working_capital" },
        { label: "Equipos", value: "equipment" },
        { label: "Expansión", value: "expansion" },
        { label: "Inventario", value: "inventory" },
        { label: "Refinanciamiento", value: "refinancing" },
        { label: "Otro", value: "other" },
    ]

    const minAmount = 1000;
    const maxAmount = 250000;
    const currencyOptions = "EUR"

    const handleLoanForm = (e) => {
        const { name, value } = e.target;

        setNewLoan({
            ...newLoanForm,
            [name]: (name === "requested_amount" || name === "term_months")
                ? value === "" ? "" : Number(value)
                : value,
        });
    };


    const closeModal = () => {
        // Forzar blur del elemento enfocado
        document.activeElement?.blur();

        const modalEl = document.getElementById("newLoanModal");
        if (modalEl) {
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance?.hide();
        }
    };

    const handleDraft = async (e) => {
        e.preventDefault();

        try {
            const createdDraft = await createNewLoan({
                ...newLoanForm,
                status: "draft",
            });

            if (!createdDraft) {
                console.error("Error al crear el borrador");
                showError("Error al crear el borrador");
                return;
            }

            const filesToUpload = {
                [DocumentTypes.FINANCIAL_STATEMENT]: document.getElementById("financeStatement")?.files,
                [DocumentTypes.BANK_STATEMENT]: document.getElementById("bankStatements")?.files,
                [DocumentTypes.OTHER]: document.getElementById("accountingReports")?.files,
            };

            console.log(filesToUpload);


            // Subir archivos a tmp usando uploadLoanDraftDocument
            for (const [docType, files] of Object.entries(filesToUpload)) {
                if (files?.length > 0) {
                    for (const file of files) {
                        await documentServices.uploadLoanDraftDocument(createdDraft.id, docType, file, true);
                    }
                }
            }

            if (onSuccess) onSuccess();
            closeModal();
            showSuccess("Borrador guardado.");

            setNewLoan({
                requested_amount: "",
                term_months: "",
                purpose: "",
                purpose_other: "",
            });

            ["financeStatement", "bankStatements", "accountingReports"].forEach(
                (id) => (document.getElementById(id).value = "")
            );

        } catch (error) {
            console.error("Error creando la solicitud de crédito:", error);
            if (error?.detail) {
                console.error("Detalle del error:", error.detail);
            }
            showError("Error al crear el borrador");

        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const createdLoan = await createNewLoan({
                ...newLoanForm,
                status: "pending",
            });

            if (!createdLoan) {
                console.error("Error al crear la solicitud");
                return;
            }

            const filesToUpload = {
                [DocumentTypes.FINANCIAL_STATEMENT]: document.getElementById("financeStatement")?.files,
                [DocumentTypes.BANK_STATEMENT]: document.getElementById("bankStatements")?.files,
                [DocumentTypes.OTHER]: document.getElementById("accountingReports")?.files,
            };

            // Subir todos los archivos directamente a private
            for (const [docType, files] of Object.entries(filesToUpload)) {
                if (files?.length > 0) {
                    for (const file of files) {
                        await documentServices.uploadLoanDocument(createdLoan.id, docType, file);
                    }
                }
            }

            if (onSuccess) onSuccess();
            showSuccess("Solicitud de préstamo creada correctamente.");
            closeModal();

            setNewLoan({
                requested_amount: "",
                term_months: "",
                purpose: "",
                purpose_other: "",
            });

            ["financeStatement", "bankStatements", "accountingReports"].forEach(
                (id) => (document.getElementById(id).value = "")
            );

        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            showError("Error al enviar la solicitud:", error);
        }
    };

    return (
        <>
            {/* Boton modal */}
            <button
                type="button"
                className="btn rounded-pill newLoan_modalBtn p-3 m-4"
                data-bs-toggle="modal"
                data-bs-target="#newLoanModal">
                Nueva Solicitud
            </button>

            {/* Modal */}
            <div
                className="modal fade"
                id="newLoanModal"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="newLoanModalLabel"
                aria-hidden="true">

                {/* cuerpo del modal */}
                <div className="modal-dialog">
                    <div className="modal-content modal_bg">
                        <div className="modal-header">
                            <h5
                                className="modal-title m-2 mx-auto newLoan_modal_title"
                                id="newLoanModalLabel">Nueva Solicitud</h5>
                            <button
                                type="button"
                                className="btn-close m-2"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => { document.activeElement?.blur() }}></button>
                        </div>
                        <div className="modal-body p-4">

                            <form onSubmit={handleSubmit}>
                                {/* input para datos de empresa no se permiten editar por cuestiones de seguridad y fraude*/}
                                {/*para editar debería de hacerlo en el perfil y a petición del usuario a un operador */}
                                <div className="mb-4">
                                    <label htmlFor="companyName" className="form-label">
                                        Nombre de la empresa
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="companyName"
                                        value={company.legal_name || ""}
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
                                        value={company.tax_id || ""}
                                        aria-label="Disabled input companyIdNumber"
                                        disabled />
                                </div>

                                <div className="mb-4 m-0">
                                    <label htmlFor="companyPhoneNumber" className="form-label">
                                        Teléfono de la empresa
                                    </label>
                                    <input
                                        className="form-control w-100"
                                        type="tel"
                                        id="companyPhoneNumber"
                                        value={company.contact_phone || ""}
                                        aria-label="Disabled input companyPhoneNumber"
                                        disabled />
                                </div>

                                <div className="mb-4 m-0">
                                    <label htmlFor="companyEmail" className="form-label">
                                        Email de la empresa
                                    </label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        id="companyEmail"
                                        value={company.contact_email || ""}
                                        aria-label="Disabled input companyEmail"
                                        disabled />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="companyAddress" className="form-label">
                                        Dirección de la empresa
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="companyAddress"
                                        value={`${company?.address?.street || ""}, ${company?.address?.city || ""}, ${company?.address?.state || ""}, ${company?.address?.zip_code || ""}, ${company?.address?.country || ""}`}
                                        aria-label="Disabled input companyAddress"
                                        disabled />
                                </div>

                                {/* Detalles del préstamo a soliticitar */}
                                <div className="mb-3 mt-5">
                                    <label htmlFor="loanAmount" className="form-label mb-0">
                                        Monton a solicitar
                                    </label>
                                    <div id="loanAmountHelpInline" className="form-text mb-2">
                                        Debe estar entre {minAmount} y {maxAmount}.
                                    </div>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            id="loanAmount"
                                            name="requested_amount"
                                            value={newLoanForm.requested_amount}
                                            className={`form-control ${errors.requested_amount ? "is-invalid" : ""}`}
                                            placeholder="0.00"
                                            min={minAmount}
                                            max={maxAmount}
                                            step="100"
                                            aria-label="Currency amount (with dot and two decimal places)"
                                            required
                                            onChange={handleLoanForm}
                                        />

                                        <span className="input-group-text">
                                            {currencyOptions}
                                        </span>
                                        <div className="invalid-feedback">{errors.requested_amount}</div>
                                    </div>

                                </div>
                                <div className="mb-4">
                                    <label htmlFor="termMonths" className="form-label">
                                        Plazo de pago:
                                    </label>

                                    <div id="termMonthsHelpInline" className="form-text mb-2">
                                        Debe introducir solo números, sin letras.
                                    </div>

                                    <div className="input-group">
                                        <input
                                            className={`form-control ${errors.term_months ? "is-invalid" : ""}`}
                                            type="number"
                                            min={minMonths}
                                            max={maxMonths}
                                            id="termMonths"
                                            name="term_months"
                                            value={newLoanForm.term_months}
                                            placeholder="Ejemplo: 12"
                                            aria-label=".form-select-sm termMonths"
                                            required
                                            aria-describedby="payment_motnhly"
                                            onChange={handleLoanForm} />
                                        <span className="input-group-text" id="payment_motnhly">
                                            {newLoanForm.term_months <= 1 ? "Mes" : "Meses"}
                                        </span>
                                    </div>
                                    <div className="invalid-feedback">{errors.term_months}</div>
                                </div>

                                <div className="mb-5">
                                    <label htmlFor="loanReason" className="form-label">
                                        Finalidad del préstamo
                                    </label>
                                    <select
                                        id="loanReason"
                                        name="purpose"
                                        value={newLoanForm.purpose}
                                        className={`form-select w-75 ${errors.purpose ? "is-invalid" : ""}`}
                                        aria-label=".form-select-sm loanReason"
                                        required
                                        onChange={handleLoanForm}>
                                        {loanReason.map((reason) => (
                                            <option key={reason.value} value={reason.value}>
                                                {reason.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="invalid-feedback">{errors.purpose}</div>
                                </div>

                                {newLoanForm.purpose === "other" && (
                                    <div className="mb-3">
                                        <label htmlFor="purpose_other">Indique la razón del préstamo:</label>
                                        <input
                                            type="text"
                                            id="purpose_other"
                                            name="purpose_other"
                                            value={newLoanForm.purpose_other}
                                            onChange={handleLoanForm}
                                            className={`form-control ${errors.purpose_other ? "is-invalid" : ""}`}
                                            required
                                        />
                                        <div className="invalid-feedback">{errors.purpose_other}</div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="financeStatement" className="form-label">
                                        Estados financieros recientes
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="financeStatement"
                                        name="estadosFinancieros"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="bankStatements" className="form-label">
                                        Extractos bancarios
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="bankStatements"
                                        name="extractosBancarios"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="accountingReports" className="form-label">
                                        Informes contables (opcional)
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="accountingReports"
                                        name="informesContables"
                                    />
                                </div>

                                <div className="modal-footer flex-column border-0">
                                    <button
                                        type="submit"
                                        className="border-0 p-2 rounded saveBtn_modal mx-auto"
                                        onClick={handleDraft}>
                                        Guardar
                                    </button>
                                    <div className="d-flex justify-content-between w-100">
                                        <button type="button"
                                            className="border-0 rounded cancelBtn_modal p-2 m-4"
                                            data-bs-dismiss="modal"
                                            onClick={() => { document.activeElement?.blur() }}>
                                            Cancelar
                                        </button>
                                        <button type="submit"
                                            className="border-0 rounded submitBtn_modal p-2 m-4"
                                            onClick={() => { document.activeElement?.blur() }}>
                                            Enviar Solicitud
                                        </button>
                                    </div>
                                </div>

                            </form>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}