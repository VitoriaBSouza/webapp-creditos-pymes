import { useState, useEffect, useRef } from "react";
import { getLoanById, updateLoanDraft, updateLoanStatus } from "../../services/creditService";
import documentServices, { DocumentTypes } from "../../services/documentServices";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";

export const EditLoanModal = ({ loanId, company, onSuccess, show, onClose }) => {
    const [newLoanForm, setNewLoanForm] = useState({
        requested_amount: "",
        term_months: "",
        purpose: "",
        purpose_other: ""
    });
    const [errors, setErrors] = useState({});
    const [existingFiles, setExistingFiles] = useState({});
    const [isEditable, setIsEditable] = useState(true);
    const modalRef = useRef(null);

    const minMonths = 1, maxMonths = 360;
    const minAmount = 1000, maxAmount = 250000;
    const currencyOptions = "EUR";

    const loanReason = [
        { label: "Elige una opción", value: "" },
        { label: "Capital de trabajo", value: "working_capital" },
        { label: "Equipos", value: "equipment" },
        { label: "Expansión", value: "expansion" },
        { label: "Inventario", value: "inventory" },
        { label: "Refinanciamiento", value: "refinancing" },
        { label: "Otro", value: "other" },
    ];

    // Inicializar modal de Bootstrap
    useEffect(() => {
        if (!modalRef.current) return;
        const modalInstance = new bootstrap.Modal(modalRef.current, { backdrop: 'static', keyboard: false });
        if (show) modalInstance.show();
        else modalInstance.hide();
    }, [show]);

    useEffect(() => {
        const fetchLoan = async () => {
            if (!loanId) return;
            const loanData = await getLoanById(loanId);
            if (!loanData) return;

            setNewLoanForm({
                requested_amount: loanData.requested_amount,
                term_months: loanData.term_months,
                purpose: loanData.purpose,
                purpose_other: loanData.purpose_other || ""
            });
            setIsEditable(loanData.status === "draft");

            if (loanData.status === "draft") {
                const docsResponse = await documentServices.getDocuments({ application_id: loanData.id });
                const docs = docsResponse?.items || [];
                const grouped = {};
                docs.forEach(f => {
                    if (!grouped[f.document_type]) grouped[f.document_type] = [];
                    grouped[f.document_type].push(f);
                });
                setExistingFiles(grouped);
            }
        };
        fetchLoan();
    }, [loanId]);

    const handleLoanForm = (e) => {
        const { name, value } = e.target;
        setNewLoanForm({
            ...newLoanForm,
            [name]: (name === "requested_amount" || name === "term_months") ? Number(value) : value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!newLoanForm.requested_amount || newLoanForm.requested_amount <= 0)
            newErrors.requested_amount = "Ingrese un monto válido mayor que 0";
        if (!newLoanForm.term_months || newLoanForm.term_months < 1)
            newErrors.term_months = "Ingrese un plazo mínimo de 1 mes";
        if (!newLoanForm.purpose) newErrors.purpose = "Seleccione la finalidad del préstamo";
        if (newLoanForm.purpose === "other" && !newLoanForm.purpose_other.trim())
            newErrors.purpose_other = "Debe especificar el propósito si eligió 'Otro'";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDraft = async () => {
        try {
            if (!validateForm()) return;
            await updateLoanDraft(loanId, null, newLoanForm);

            const filesToUpload = {
                [DocumentTypes.FINANCIAL_STATEMENT]: document.getElementById("financeStatement")?.files,
                [DocumentTypes.BANK_STATEMENT]: document.getElementById("bankStatements")?.files,
                [DocumentTypes.OTHER]: document.getElementById("accountingReports")?.files,
            };

            for (const [docType, files] of Object.entries(filesToUpload)) {
                if (files && files.length > 0) {
                    for (const file of files) {
                        await documentServices.uploadLoanDocument(loanId, docType, file);
                    }
                }
            }

            window.alert("Borrador del préstamo guardado correctamente");
            onSuccess?.();
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileDelete = async (docType, fileId) => {
        await documentServices.deleteLoanDocument(fileId);
        setExistingFiles(prev => ({
            ...prev,
            [docType]: prev[docType].filter(f => f.id !== fileId)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || !isEditable) return;

        await updateLoanStatus(loanId, "pending", newLoanForm);

        const filesToUpload = {
            [DocumentTypes.FINANCIAL_STATEMENT]: document.getElementById("financeStatement")?.files,
            [DocumentTypes.BANK_STATEMENT]: document.getElementById("bankStatements")?.files,
            [DocumentTypes.OTHER]: document.getElementById("accountingReports")?.files,
        };

        for (const [docType, files] of Object.entries(filesToUpload)) {
            if (files && files.length > 0) {
                for (const file of files) {
                    await documentServices.uploadLoanDocument(loanId, docType, file);
                }
            }
        }

        onSuccess?.();
        onClose?.();
    };

    return (
        <div ref={modalRef} className="modal fade" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content modal_bg">
                    <div className="modal-header">
                        <h5 className="modal-title mx-auto">Editar Solicitud</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4 text-start">
                        <form onSubmit={handleSubmit}>
                            {/* Empresa info */}
                            <div className="mb-4"><label className="form-label">Nombre de la empresa</label>
                                <input className="form-control" type="text" value={company.legal_name || ""} disabled />
                            </div>
                            {/* Loan inputs */}
                            <div className="mb-3">
                                <label className="form-label">Monto a solicitar</label>
                                <input type="number" name="requested_amount" value={newLoanForm.requested_amount}
                                    className={`form-control ${errors.requested_amount ? "is-invalid" : ""}`}
                                    min={minAmount} max={maxAmount} step="100" required
                                    onChange={handleLoanForm} disabled={!isEditable} />
                                <div className="invalid-feedback">{errors.requested_amount}</div>
                            </div>

                            <div className="modal-footer flex-column border-0">
                                <button type="button" className="btn saveBtn_modal mx-auto" onClick={handleDraft} disabled={!isEditable}>Guardar</button>
                                <div className="d-flex justify-content-between w-100 mt-3">
                                    <button type="button" className="btn cancelBtn_modal" onClick={onClose}>Cancelar</button>
                                    <button type="submit" className="btn submitBtn_modal" disabled={!isEditable}>Enviar Solicitud</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
