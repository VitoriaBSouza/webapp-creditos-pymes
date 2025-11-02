import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

//CSS files
import '../features/LoanDetails/LoanPage.css';

//services
import userServices from "../services/userServices";

//Components
import { UserDetailSection } from "../features/LoanDetails/UserDetailSection";
import { StatusDropDown } from "../features/LoanDetails/StatusDropDown";
import { DocumentSection } from "../features/LoanDetails/DocumentSection";
import { loanDetails } from "../features/LoanDetails/loanDetails";

//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export const LoanDetailsPage = () => {

    const navigate = useNavigate();
    const loanId = useParams();
    const [loanIdState] = useState(loanId.loan_id);

    const { loading, loan, company, client, documents } = loanDetails(loanIdState);

    useEffect(() => {
        if (loan?.status === "draft") {
            navigate("/partner-dashboard");
        }
    }, [loan, navigate, documents]);

    if (loading) return <p className="text-center mt-5 fs-5">Cargando datos...</p>;

    return (
        <div className="container-fluid p-4">
            <button type="button"
                className="btn border-0 m-4"
                onClick={() => { navigate("/partner-dashboard") }}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-2 return_to_home_btn" />
                <span className="return_to_home_btn">Volver atrás</span>
            </button>

            <h1 className="text-center mt-4 text-secondary fw-bold">
                Solicitud ID
            </h1>

            <h3 className="text-center mb-4 text-secondary fw-bold">
                {loanIdState}
            </h3>

            <StatusDropDown loan_details={loan} />

            <UserDetailSection
                loan_details={loan}
                company_details={company}
                client_details={client}
            />

            <DocumentSection
                loan_documents={documents}
                loan_id={loanIdState}
                client_details={client}
            />
        </div>
    );
}