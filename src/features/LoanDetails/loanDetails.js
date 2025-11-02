
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//services
import { getLoanById } from "../../services/creditService";
import companyServices from "../../services/companyServices";
import userServices from "../../services/userServices";
import documentServices from "../../services/documentServices";

export const loanDetails = (loan_id) => {
    
    const navigate = useNavigate();    

    const [loan, setLoan] = useState(null);
    const [company, setCompany] = useState(null);
    const [client, setClient] = useState(null);
    const [documents, setDocuments] = useState([]);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);

            try {
                //fetch loan details by loan_id
                const loanData = await getLoanById(loan_id);
                
                if (!loanData) {
                    navigate("/partner-dashboard");
                    return;
                }

                setLoan({
                    id: loanData.id,
                    company_id: loanData.company_id,
                    requested_amount: loanData.requested_amount,
                    purpose: loanData.purpose,
                    purpose_other: loanData.purpose_other,
                    term_months: loanData.term_months,
                    status: loanData.status,
                    risk_score: loanData.risk_score,
                    approved_amount: loanData.approved_amount,
                    interest_rate: loanData.interest_rate,
                    created_at: loanData.created_at,
                    updated_at: loanData.updated_at,
                    documents: loanData.documents || [],
                });                

                //fetch company details with company_id
                const companyData = await companyServices.getCompanyById(loanData.company_id);
                if (!companyData) return;

                setCompany({
                    id: companyData.id,
                    user_id: companyData.user_id,
                    legal_name: companyData.legal_name,
                    tax_id: companyData.tax_id,
                    contact_email: companyData.contact_email,
                    contact_phone: companyData.contact_phone,
                    address: `${companyData?.address?.street}, ${companyData?.address?.city}, ${companyData?.address?.state}, ${companyData?.address?.zip_code}, ${companyData?.address?.country}`,
                    created_at: companyData.created_at,
                    updated_at: companyData.updated_at,
                });

                // fetch user profile details by ID
                const clientProfile = await userServices.getProfileById(companyData.user_id);
                if (!clientProfile) return;

                setClient({
                    name: `${clientProfile.first_name} ${clientProfile.last_name}`,
                    email: clientProfile.email,
                    id: clientProfile.id,
                });

                const docsData = await documentServices.getDocuments({ application_id: loanData.id });
                setDocuments(docsData?.items);

                setLoading(false);
            } catch (err) {
                console.error("Error loading loan details:", err);
                setError(err);
                navigate("/partner-dashboard");
            }
        };

        loadAll();
    }, [loan_id, navigate]);

    return { loading, loan, company, client, documents, error };
};
