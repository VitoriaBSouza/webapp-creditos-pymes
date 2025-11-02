import { useState } from "react";

// CSS
import "../../components/Table/Table.css";

// Components
import { EditLoanModal } from "../CreateNewLoan/EditLoan";
import { AttachDocumentModal } from "./AttachDocument";

export default function ActionsDropdown({ row, company, onSuccess }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAttachModal, setShowAttachModal] = useState(false);

    const canEdit = row.status === "draft";
    const canAttachDocument = row.status === "pending";

    const handleBorrar = () => {
        console.log("🗑️ Borrar solicitud:", row.id);
    };

    return (
        <div className="dropdown text-center">
            <button
                className="btn btn-sm bg_dropdown_action_toggle dropdown-toggle border-0 shadow-none fs-4"
                type="button"
                id={`dropdownMenu-${row.id}`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                ☰
            </button>

            <ul
                className="dropdown-menu dropdown-menu-end shadow-sm bg-white"
                aria-labelledby={`dropdownMenu-${row.id}`}
            >
                {canEdit && (
                    <li className="m-2">
                        <button
                            className="dropdown-item bg_dropdown_item_actions dropdown_item_edit border-0 rounded"
                            type="button"
                            onClick={() => setShowEditModal(true)}
                        >
                            Editar
                        </button>
                    </li>
                )}

                {canAttachDocument && (
                    <li className="m-2">
                        <button
                            className="dropdown-item bg_dropdown_item_actions dropdown_item_attach border-0 rounded"
                            type="button"
                            onClick={() => setShowAttachModal(true)}
                        >
                            Adjuntar Documento
                        </button>
                    </li>
                )}

                {row.status === "pending" || row.status === "draft" ? <li className="m-2">
                    <button
                        className="dropdown-item bg_dropdown_item_actions dropdown_item_cancel border-0 rounded"
                        type="button"
                        onClick={handleBorrar}
                    >
                        {row.status === "draft" ? "Borrar" : row.status === "pending" ? "Cancelar" : ""}
                    </button>
                </li> : null
                }
            </ul>

            {/* Renderiza los modales solo si están abiertos */}
            {showEditModal && (
                <EditLoanModal
                    loanId={row.id}
                    company={company}
                    modalId={`editLoanModal-${row.id}`}
                    onSuccess={() => {
                        onSuccess?.();
                        setShowEditModal(false);
                    }}
                />
            )}

            {showAttachModal && (
                <AttachDocumentModal
                    loanId={row.id}
                    modalId={`${row.id}-attachDocument`}
                    onClose={() => setShowAttachModal(false)}
                />
            )}
        </div>
    );
}