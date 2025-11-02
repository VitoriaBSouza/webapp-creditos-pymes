
import { useState } from 'react';
import './LoanPage.css';
import documentServices from '../../services/documentServices';

export const RequestDocumentBtn = ({ application_id, user_id }) => {
    const [documentTitle, setDocumentTitle] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!documentType) return;

        setLoading(true);

        try {
            const newDocument = await documentServices.requestDocument({
                application_id,
                user_id,
                document_type: documentType,
                title: documentTitle,
                status: 'pending'
            });

            console.log('Documento solicitado:', newDocument);

            // Close modal
            const modalEl = document.getElementById('requestDocument');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

            // Reset form
            setDocumentTitle('');
            setDocumentType('');

        } catch (err) {
            console.error('Error solicitando documento:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                className="btn request_document_btn rounded-pill py-0 px-3"
                data-bs-toggle="modal"
                data-bs-target="#requestDocument">
                Solicitar Documento
            </button>

            <div className="modal fade"
                id="requestDocument"
                tabIndex="-1"
                aria-labelledby="requestDocumentLabel"
                aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="requestDocumentLabel">Solicitar Documento</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="documentTitle" className="form-label">
                                        Título del documento:
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="documentTitle"
                                        value={documentTitle}
                                        onChange={e => setDocumentTitle(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="documentType" className="form-label">
                                        Tipo de documento:
                                    </label>
                                    <select
                                        id="documentType"
                                        value={documentType}
                                        onChange={e => setDocumentType(e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Seleccionar tipo de documento</option>
                                        <option value="tax_return">Declaración de impuestos</option>
                                        <option value="financial_statement">Estado financiero</option>
                                        <option value="id_document">Documento de identidad</option>
                                        <option value="business_license">Licencia comercial</option>
                                        <option value="bank_statement">Extracto bancario</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                                <div className='d-flex justify-content-around pt-3'>
                                    <button type="button" className="btn btn-danger w-25 p-2" data-bs-dismiss="modal">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn submit_send_btn p-2 w-25" disabled={loading}>
                                        {loading ? 'Enviando...' : 'Solicitar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};