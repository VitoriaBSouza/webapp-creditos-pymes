
import { useEffect, useState } from 'react';
import { supabase } from '../../auth/supabaseClient';
import documentServices from '../../services/documentServices';

export const ReviewDocumentModal = ({ document_path, modalId, document_title, loan_id, document_id }) => {
    const [signedUrl, setSignedUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const getDocumentSignedUrl = async (path) => {
        if (!path) return null;

        const { data, error } = await supabase
            .storage
            .from('documents')
            .createSignedUrl(path, 60);

        if (error) {
            console.error("Supabase Storage error:", error.message);
            return null;
        }

        return data?.signedUrl || null;
    };

    useEffect(() => {
        const fetchSignedUrl = async () => {
            if (!document_path) return;

            setLoading(true);
            try {
                const url = await getDocumentSignedUrl(document_path);
                setSignedUrl(url);
            } catch (err) {
                console.error("Error getting signed URL:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSignedUrl();
    }, [document_path, loan_id]);

    const handleAction = async (status) => {
        if (!document_id) {
            console.error("document_id is required");
            return;
        }

        setActionLoading(true);
        try {
            let result;
            if (status === "approved") {
                result = await documentServices.approve({ document_id });
            } else if (status === "rejected") {
                result = await documentServices.reject({ document_id });
            }

            // Close modal
            const modalEl = document.getElementById(modalId);
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

        } catch (err) {
            console.error(`Error ${status} documento:`, err);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                className="btn border-0 m-0 review_document_btn"
                data-bs-toggle="modal"
                data-bs-target={`#${modalId}`}>
                Revisar
            </button>

            <div
                className="modal fade"
                id={modalId}
                tabIndex="-1"
                aria-labelledby={`reviewDocumentLabel-${modalId}`}
                aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">

                        <div className="modal-header p-3">
                            <h5 className="modal-title">
                                Revisar Documento:
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => { document.activeElement?.blur() }}></button>
                        </div>

                        <div className="modal-body p-4 m-0 p-0">
                            <h6 className="fw-bold mb-4 mt-2">
                                {document_title}
                            </h6>
                            {loading ? (
                                <p className="fs-5 text-center">Cargando documento...</p>
                            ) : signedUrl ? (
                                <iframe
                                    src={signedUrl}
                                    title="documento"
                                    className="documentView"
                                ></iframe>
                            ) : (
                                <p className='fs-5 text-center'>No se pudo cargar el documento.</p>
                            )}
                        </div>

                        <div className="modal-footer d-flex justify-content-between px-5 py-2">
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleAction("rejected")}
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Procesando..." : "Rechazar"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => handleAction("approved")}
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Procesando..." : "Aprobar"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
