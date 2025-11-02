import { useEffect, useState } from "react";

//CSS files
import './LoanPage.css';
import { updateLoanDraft, updateLoanStatus } from "../../services/creditService";
import { showError, showSuccess } from "../../services/toastService";

export const StatusDropDown = ({ loan_details }) => {

    const [loanData, setLoanData] = useState(loan_details);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (loan_details) setLoanData(loan_details);
    }, [loan_details]);

    const statusTypes = (status) => {
        if (status === "pending") return "Pendiente";
        if (status === "in_review") return "En revisión";
        if (status === "approved") return "Aprobado";
        if (status === "rejected") return "Rechazado";
    }

    const handleSelect = async (newStatus) => {
        if (newStatus === loanData.status) {
            setOpen(false);
            return;
        }

        try {
            const updatedLoan = await updateLoanStatus(loan_details.id, newStatus);

            // Verifica que la respuesta tenga un id o lo que sea que indique éxito
            if (!updatedLoan?.id) {
                throw new Error("No se pudo actualizar el préstamo en el backend");
            }

            setLoanData(updatedLoan);
            showSuccess("Estado de préstamo actualizado correctamente");

        } catch (err) {
            console.error("Error actualizando préstamo:", err);
            // Mostrar mensaje legible
            if (err?.detail) {
                showError(err.detail);
            } else if (err instanceof Error) {
                showError(err.message);
            } else {
                showError(JSON.stringify(err));
            }
        } finally {
            setOpen(false);
        }
    };

    return (
        <div className={`btn-group d-flex ms-auto justify-content-between 
        ${loanData?.status === "pending" ?
                "button_status_size_pending"
                : loanData?.status === "approved"
                    ? "button_status_size_approved"
                    : loanData?.status === "in_review"
                        ? "button_status_size_in-review"
                        : "button_status_size_declined"
            }`}>
            <button
                type="button"
                className={`btn dropdown-toggle ${loanData?.status === "pending"
                    ? "pending_status_dropdown"
                    : loanData?.status === "approved"
                        ? "approved_status_dropdown"
                        : loanData?.status === "in_review"
                            ? "in_review_status_dropdown"
                            : "declined_status_dropdown"
                    }`}
                aria-expanded="false"
                onClick={() => setOpen(!open)}>
                {statusTypes(loanData?.status)}
            </button>
            {open && (
                <ul
                    className={`dropdown-menu dropdown-menu-end mt-5 p-0 ${open ? "show" : ""}`}>

                    <li>
                        <button
                            className="dropdown-item in_review_status_dropdown py-2"
                            type="button"
                            onClick={() => handleSelect("in_review")}>
                            En revisión
                        </button>
                    </li>

                    <li>
                        <button
                            className="dropdown-item approved_status_dropdown py-2"
                            type="button"
                            onClick={() => handleSelect("approved")}>
                            Aprobado
                        </button>
                    </li>
                    <li>
                        <button
                            className="dropdown-item declined_status_dropdown py-2"
                            type="button"
                            onClick={() => handleSelect("rejected")}>
                            Rechazado
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
}