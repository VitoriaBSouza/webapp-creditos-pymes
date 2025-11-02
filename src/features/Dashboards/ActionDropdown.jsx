import { useState, useEffect } from "react";
import { deleteLoan, getLoanById, updateLoanDraft, updateLoanStatus } from "../../services/creditService";
import documentServices, { DocumentTypes } from "../../services/documentServices";
import { showError, showSuccess } from "../../services/toastService";

export default function ActionsDropdown({ row, company, onSuccess, page }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAttachModal, setShowAttachModal] = useState(false);

    const [selectedType, setSelectedType] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const canEdit = row.status === "draft";
    const canAttachDocument = row.status === "pending";
    const [errors, setErrors] = useState({});
    const [isEditable, setIsEditable] = useState(true);
    const [existingFiles, setExistingFiles] = useState({});

    const currencyOptions = "EUR";
    const minMonths = 1, maxMonths = 360;
    const minAmount = 1000;
    const maxAmount = 250000;

    const [newLoanForm, setNewLoanForm] = useState({
        requested_amount: row.requested_amount || "",
        term_months: row.term_months || "",
        purpose: row.purpose || "",
        purpose_other: row.purpose_other || "",
    });

    const loanReason = [
        { label: "Elige una opción", value: "" },
        { label: "Capital de trabajo", value: "working_capital" },
        { label: "Equipos", value: "equipment" },
        { label: "Expansión", value: "expansion" },
        { label: "Inventario", value: "inventory" },
        { label: "Refinanciamiento", value: "refinancing" },
        { label: "Otro", value: "other" },
    ];

    const documentTypeOptions = [
        { value: DocumentTypes.TAX_RETURN, label: "Declaración de impuestos" },
        { value: DocumentTypes.FINANCIAL_STATEMENT, label: "Estados financieros" },
        { value: DocumentTypes.ID_DOCUMENT, label: "Documento de identidad" },
        { value: DocumentTypes.BUSINESS_LICENSE, label: "Licencia comercial" },
        { value: DocumentTypes.BANK_STATEMENT, label: "Extractos bancarios" },
        { value: DocumentTypes.OTHER, label: "Otros" },
    ];

    const documentTypes = [
        { id: DocumentTypes.FINANCIAL_STATEMENT, label: "Estados financieros recientes", required: true },
        { id: DocumentTypes.BANK_STATEMENT, label: "Extractos bancarios", required: true },
        { id: DocumentTypes.OTHER, label: "Informes contables (opcional)", required: false }
    ];

    const validateForm = () => {
        const newErrors = {};
        if (!newLoanForm.requested_amount || newLoanForm.requested_amount <= 0)
            newErrors.requested_amount = "Ingrese un monto válido mayor que 0";
        if (!newLoanForm.term_months || newLoanForm.term_months < 1)
            newErrors.term_months = "Ingrese un plazo mínimo de 1 mes";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (!showEditModal) return;

        const fetchDraftDocuments = async () => {
            const groupedFiles = await documentServices.getDraftDocuments(row.id);
            console.log(groupedFiles);

            setExistingFiles(groupedFiles);
            onSuccess?.();
        };

        fetchDraftDocuments();
    }, [showEditModal, row.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLoanForm((prev) => ({
            ...prev,
            [name]: ["requested_amount", "term_months"].includes(name)
                ? Number(value)
                : value,
        }));
    };

    const handleDraft = async () => {
        try {
            if (!validateForm()) return;

            const updatedDraft = {
                ...newLoanForm,
                status: "draft"
            };

            await updateLoanDraft(row.id, updatedDraft);

            const filesToUpload = {
                [DocumentTypes.FINANCIAL_STATEMENT]: document.getElementById(DocumentTypes.FINANCIAL_STATEMENT)?.files,
                [DocumentTypes.BANK_STATEMENT]: document.getElementById(DocumentTypes.BANK_STATEMENT)?.files,
                [DocumentTypes.OTHER]: document.getElementById(DocumentTypes.OTHER)?.files,
            };

            for (const [docType, files] of Object.entries(filesToUpload)) {
                if (files?.length) {
                    for (const file of files) {
                        await documentServices.uploadLoanDraftDocument(row.id, docType, file, true);
                    }
                }
            }

            // Actualizar cache y estado local para reflejar cambios inmediatamente
            const cachedLoans = JSON.parse(sessionStorage.getItem(`loans-page-${page}`)) || [];
            const updatedLoans = cachedLoans.map(l => l.id === row.id ? { ...l, ...updatedDraft } : l);

            sessionStorage.setItem(`loans-page-${page}`, JSON.stringify(updatedLoans));

            showSuccess("Borrador del préstamo guardado correctamente");
            onSuccess?.();
            setShowEditModal(false);
        } catch (error) {
            console.error(error);
            showError("Error al guardar borrador");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || !isEditable) return;

        try {
            const updatedLoan = {
                ...newLoanForm,
                status: "pending", // or whatever status means submitted
            };

            // Update the loan in the backend
            await updateLoanDraft(row.id, updatedLoan);

            // Upload files
            const filesToUpload = {
                [DocumentTypes.FINANCIAL_STATEMENT]: document.getElementById(DocumentTypes.FINANCIAL_STATEMENT)?.files,
                [DocumentTypes.BANK_STATEMENT]: document.getElementById(DocumentTypes.BANK_STATEMENT)?.files,
                [DocumentTypes.OTHER]: document.getElementById(DocumentTypes.OTHER)?.files,
            };

            for (const [docType, files] of Object.entries(filesToUpload)) {
                if (files?.length) {
                    for (const file of files) {
                        await documentServices.uploadLoanDocument(row.id, docType, file);
                    }
                }
            }

            // Update local cache
            const cachedLoans = JSON.parse(sessionStorage.getItem(`loans-page-${page}`)) || [];
            const updatedLoans = cachedLoans.map(l => l.id === row.id ? { ...l, ...updatedLoan } : l);
            sessionStorage.setItem(`loans-page-${page}`, JSON.stringify(updatedLoans));

            showSuccess("Solicitud enviada correctamente");
            onSuccess?.();
            setShowEditModal(false);
        } catch (error) {
            console.error("Error al enviar solicitud:", error);
            showError("Error al enviar solicitud");
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta solicitud y todos sus documentos?")) return;

        try {
            // Primero eliminar archivos (tmp + private)
            await documentServices.deleteAllLoanDocuments(row.id);

            // Luego eliminar la solicitud
            const success = await deleteLoan(row.id);

            if (success) {
                // Actualizar cache local y UI
                const cachedLoans = JSON.parse(sessionStorage.getItem(`loans-page-${page}`)) || [];
                const updatedLoans = cachedLoans.filter(l => l.id !== row.id);
                sessionStorage.setItem(`loans-page-${page}`, JSON.stringify(updatedLoans));

                showSuccess("Solicitud y documentos eliminados correctamente");
                onSuccess?.();
            } else {
                showError("No se pudo eliminar la solicitud");
            }
        } catch (err) {
            console.error("Error eliminando solicitud y documentos:", err);
            showError("Ocurrió un error al eliminar la solicitud");
        }
    };

    const handleAttachDocument = async () => {
        try {
            const filesToUpload = {
                [DocumentTypes.FINANCIAL_STATEMENT]: document.getElementById(DocumentTypes.FINANCIAL_STATEMENT)?.files,
                [DocumentTypes.BANK_STATEMENT]: document.getElementById(DocumentTypes.BANK_STATEMENT)?.files,
                [DocumentTypes.OTHER]: document.getElementById(DocumentTypes.OTHER)?.files,
            };

            for (const [docType, files] of Object.entries(filesToUpload)) {
                if (files?.length) {
                    for (const file of files) {
                        // Subir directamente a private
                        await documentServices.uploadLoanDocument(row.id, docType, file);
                    }
                }
            }

            showSuccess("Documentos adjuntados correctamente");
            onSuccess?.();
            setShowAttachModal(false)
        } catch (error) {
            console.error("Error adjuntando documentos:", error);
            showError("No se pudieron adjuntar los documentos");
        }
    };

    return (
        <>
            <div className="btn-group text-center">
                <button
                    className="btn btn-sm bg_dropdown_action_toggle dropdown-toggle border-0 shadow-none fs-4"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    ☰
                </button>

                <div className="dropdown-menu dropdown-menu-end shadow-sm bg-white">
                    {canEdit && (
                        <button
                            className="dropdown-item bg_dropdown_item_actions dropdown_item_edit border-0 rounded"
                            type="button"
                            onClick={() => setShowEditModal(true)}
                        >
                            Editar
                        </button>
                    )}

                    {canAttachDocument && (
                        <button
                            className="dropdown-item bg_dropdown_item_actions dropdown_item_attach border-0 rounded"
                            type="button"
                            onClick={() => setShowAttachModal(true)}
                        >
                            Adjuntar Documento
                        </button>
                    )}

                    {(row.status === "draft") && (
                        <button
                            className="dropdown-item bg_dropdown_item_actions dropdown_item_cancel border-0 rounded"
                            type="button"
                            onClick={handleDelete}
                        >
                            Borrar
                        </button>
                    )}
                </div>
            </div>

            {/* Edit Loan Modal */}
            {showEditModal && (
                <div
                    className="modal fade show d-block"
                    id={`editLoanModal${row.id}`}
                    tabIndex={-1}
                    aria-labelledby={`editLoanModalLabel${row.id}`}
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content p-4">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Solicitud</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowEditModal(false)}
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                <form>
                                    {/* Empresa */}
                                    <div className="mb-4">
                                        <label htmlFor="companyName" className="form-label">Nombre de la empresa</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="companyName"
                                            value={company.legal_name || ""}
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="companyIdNumber" className="form-label">Identificador fiscal de la empresa</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="companyIdNumber"
                                            value={company.tax_id || ""}
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-4 m-0">
                                        <label htmlFor="companyPhoneNumber" className="form-label">Teléfono de la empresa</label>
                                        <input
                                            className="form-control"
                                            type="tel"
                                            id="companyPhoneNumber"
                                            value={company.contact_phone || ""}
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-4 m-0">
                                        <label htmlFor="companyEmail" className="form-label">Email de la empresa</label>
                                        <input
                                            className="form-control"
                                            type="email"
                                            id="companyEmail"
                                            value={company.contact_email || ""}
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="companyAddress" className="form-label">Dirección de la empresa</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            id="companyAddress"
                                            value={`${company?.address?.street || ""}, ${company?.address?.city || ""}, ${company?.address?.state || ""}, ${company?.address?.zip_code || ""}, ${company?.address?.country || ""}`}
                                            disabled
                                        />
                                    </div>

                                    {/* Detalles del préstamo */}
                                    <div className="mb-3 mt-5">
                                        <label htmlFor="loanAmount" className="form-label mb-0">Monto a solicitar</label>
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
                                                min={minAmount}
                                                max={maxAmount}
                                                step="100"
                                                onChange={handleChange}
                                                required
                                            />
                                            <span className="input-group-text">{currencyOptions}</span>
                                            <div className="invalid-feedback">{errors.requested_amount}</div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="termMonths" className="form-label">Plazo de pago:</label>
                                        <div id="termMonthsHelpInline" className="form-text mb-2">Debe introducir solo números, sin letras.</div>
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
                                                onChange={handleChange}
                                                required
                                            />
                                            <span className="input-group-text" id="payment_monthly">
                                                {newLoanForm.term_months <= 1 ? "Mes" : "Meses"}
                                            </span>
                                        </div>
                                        <div className="invalid-feedback">{errors.term_months}</div>
                                    </div>

                                    <div className="mb-5">
                                        <label htmlFor="loanReason" className="form-label">Finalidad del préstamo</label>
                                        <select
                                            id="documentType"
                                            className="form-select"
                                            value={selectedType}
                                            onChange={e => setSelectedType(e.target.value)}
                                        >
                                            <option value="">Selecciona un tipo</option>
                                            {documentTypeOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                                                onChange={handleChange}
                                                className={`form-control ${errors.purpose_other ? "is-invalid" : ""}`}
                                                required
                                            />
                                            <div className="invalid-feedback">{errors.purpose_other}</div>
                                        </div>
                                    )}

                                    {/* Archivos */}
                                    {documentTypes.map(doc => (
                                        <div className="mb-3" key={doc.id}>
                                            <label htmlFor={doc.id} className="form-label">{doc.label}</label>

                                            {/* Mostrar archivos existentes */}
                                            {existingFiles[doc.id]?.map(file => (
                                                <div className="d-flex justify-content-between align-items-center mb-1" key={file.id}>
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={async () => {
                                                            await documentServices.deleteLoanDraftDocument(row.id, file.id);
                                                            setExistingFiles(prev => ({
                                                                ...prev,
                                                                [doc.id]: prev[doc.id].filter(f => f.id !== file.id)
                                                            }));
                                                        }}
                                                    >X</button>
                                                </div>
                                            ))}

                                            {/* Mostrar input solo si no hay archivos */}
                                            {!existingFiles[doc.id]?.length && (
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id={doc.id}
                                                    name={doc.id}
                                                    required={doc.required}
                                                />
                                            )}
                                        </div>
                                    ))}

                                    {/* Footer */}
                                    <div className="modal-footer flex-column border-0">
                                        <button type="button" className="border-0 p-2 rounded saveBtn_modal mx-auto" onClick={handleDraft}>Guardar</button>
                                        <div className="d-flex justify-content-between w-100">
                                            <button type="button" className="border-0 rounded cancelBtn_modal p-2 m-4" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                            <button type="button" className="border-0 rounded submitBtn_modal p-2 m-4" onClick={handleSubmit}>Enviar Solicitud</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Attach Document Modal */}
            {showAttachModal && (
                <div className="modal fade show d-block" tabIndex={-1} aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content p-4">
                            <div className="modal-header">
                                <h5 className="modal-title">Adjuntar Documento</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAttachModal(false)}
                                    aria-label="Close"
                                />
                            </div>

                            <div className="modal-body">
                                <form>
                                    {/* Tipo de documento */}
                                    <div className="mb-3">
                                        <label htmlFor="documentType" className="form-label">Tipo de Documento</label>
                                        <select
                                            id="documentType"
                                            className="form-select"
                                            value={selectedType}
                                            onChange={e => setSelectedType(e.target.value)}
                                        >
                                            <option value="">Selecciona un tipo</option>
                                            {Object.entries(DocumentTypes).map(([key, type]) => (
                                                <option key={type} value={type}>
                                                    {type.replaceAll("_", " ")}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Archivo */}
                                    <div className="mb-3">
                                        <label htmlFor="documentFile" className="form-label">Archivo</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="documentFile"
                                            onChange={e => setSelectedFile(e.target.files[0])}
                                        />
                                    </div>

                                    {/* Archivos existentes */}
                                    {existingFiles[selectedType]?.length > 0 && (
                                        <div className="mb-3">
                                            <label className="form-label">Archivos existentes:</label>
                                            {existingFiles[selectedType].map(file => (
                                                <div key={file.id} className="d-flex justify-content-between align-items-center mb-1">
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={async () => {
                                                            await documentServices.deleteLoanDraftDocument(row.id, file.id);
                                                            setExistingFiles(prev => ({
                                                                ...prev,
                                                                [selectedType]: prev[selectedType].filter(f => f.id !== file.id)
                                                            }));
                                                        }}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="modal-footer flex-column border-0">
                                        <button
                                            type="button"
                                            className="btn btn-primary mx-auto"
                                            disabled={!selectedType || !selectedFile}
                                            onClick={async () => {
                                                if (!selectedType || !selectedFile) return;
                                                await documentServices.uploadLoanDocument(row.id, selectedType, selectedFile);

                                                // Actualizar estado local para render inmediato
                                                const newFile = {
                                                    id: selectedFile.name,
                                                    name: selectedFile.name,
                                                    url: URL.createObjectURL(selectedFile)
                                                };
                                                setExistingFiles(prev => ({
                                                    ...prev,
                                                    [selectedType]: [...(prev[selectedType] || []), newFile]
                                                }));

                                                setSelectedFile(null);
                                                setSelectedType("");
                                            }}
                                        >
                                            Subir Documento
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary mx-auto mt-2"
                                            onClick={() => setShowAttachModal(false)}
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}