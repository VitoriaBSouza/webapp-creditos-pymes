import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//CSS
import './LoanPage.css';

//services
import { getLoanById } from "../../services/creditService.js";
import companyServices from '../../services/companyServices.js';
import userServices from '../../services/userServices.js';

export const UserDetailSection = ({ loan_details, company_details, client_details }) => {

    const loanData = loan_details;
    const companyDetails = company_details;
    const representative = client_details;

    const capitalizeFirstLetter = (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

    return (
        <div className="row m-4">
            <div className="col-md-6 mt-3 lh-sm p-2">
                <h3 className="mb-4 subtitle_loan_details_page">Detalles Empresa:</h3>

                <div className='d-flex'>
                    <p className="loan_fields_text">Nombre de la empresa:</p>
                    <p className='ms-2 loan_details_text capitalize'>{companyDetails.legal_name}</p>
                </div>

                <div className='d-flex'>
                    <p className="loan_fields_text">Número fiscal de la empresa:</p>
                    <p className='ms-2 loan_details_text'>{companyDetails.tax_id}</p>
                </div>

                <div className='d-flex m-0'>
                    <p className="loan_fields_text">Dirección:</p>
                    <p className='ms-2 loan_details_text'>{companyDetails.address}</p>
                </div>
            </div>

            <div className="col-6 mt-4 lh-sm p-2">
                <div className='d-flex'>
                    <h5 className='loan_fields_text'>Representante:</h5>
                    <p className='ms-2 loan_details_text'>
                        {representative.name}
                    </p>
                </div>
                <div className='d-flex'>
                    <h5 className='loan_fields_text'>Email representante:</h5>
                    <p className='ms-2 loan_details_text'>
                        {representative.email}
                    </p>
                </div>
                <div className='d-flex m-0'>
                    <h5 className='loan_fields_text'>Teléfono de la empresa:</h5>
                    <p className='ms-2 loan_details_text'>
                        {companyDetails.contact_phone}
                    </p>
                </div>
                <div className='d-flex m-0'>
                    <h5 className='loan_fields_text'>Email de la empresa:</h5>
                    <p className='ms-2 loan_details_text'>
                        {companyDetails.contact_email}
                    </p>
                </div>
            </div>

            <div className="col-6 align-self-end mt-3 m-0">
                <div className='d-flex'>
                    <h5 className='loan_fields_text'>Montón solicitado:</h5>
                    <p className='ms-2 loan_details_text text-success fw-bold'>
                        {loanData.requested_amount}
                    </p>
                </div>
                <div className='d-flex'>
                    <h5 className='loan_fields_text'>Finalidad del crédito:</h5>
                    <p className='ms-2 loan_details_text'>
                        {loanData.purpose == "other" ? `${capitalizeFirstLetter(loanData.purpose)} - ${capitalizeFirstLetter(loanData.purpose_other)}` : capitalizeFirstLetter(loanData.purpose)}
                    </p>
                </div>
            </div>

        </div>
    );
}