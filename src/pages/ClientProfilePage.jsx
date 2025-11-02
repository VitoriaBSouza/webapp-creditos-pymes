import { useEffect, useState } from "react";

//CSS files
import "../features/ProfileFormClient/ProfileClient.css";

//services
import { showError } from "../services/toastService";
import userServices from "../services/userServices";

//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUser } from '@fortawesome/free-regular-svg-icons';

//Components
import { CompanyDetails } from "../features/ProfileFormClient/CompanyDetails";
import { UserDetails } from "../features/ProfileFormClient/UserDetails";

export const ClientProfilePage = () => {
    const [companyForm, setCompanyForm] = useState(true);
    const [userForm, setUserForm] = useState(false);
    const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem("user")));

    useEffect(() => {
        const userDetails = async () => {
            try {
                // Perfil
                if (!user?.id) {
                    const profile = await userServices.getMyProfile();
                    if (profile) {
                        sessionStorage.setItem("user", JSON.stringify(profile));
                        setUser(profile);
                    }
                }
            } catch (err) {
                console.error("Error al inicializar perfil:", err);
                showError("Error al cargar datos del perfil");
            }
        };

        userDetails();
    }, []);

    return (
        <div className="container-fluid p-5">
            <div className="d-flex justify-content-center mt-4 mb-2">
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button
                        type="button"
                        className={`btn rounded-0 pb-2 border-0 ${companyForm ? "profile_page_form" : ""}`}
                        onClick={() => { setCompanyForm(true); setUserForm(false) }}>
                        <FontAwesomeIcon icon={faHouse} className="icons_profile_page" />
                    </button>
                    <button
                        type="button"
                        className={`btn rounded-0 pb-2 border-0 ${userForm ? "profile_page_form" : ""}`}
                        onClick={() => { setCompanyForm(false); setUserForm(true) }}>
                        <FontAwesomeIcon icon={faUser} className="icons_profile_page" />
                    </button>
                </div>
            </div>

            {companyForm ? 
                <CompanyDetails/> 
                : 
                <UserDetails user={user} />}
        </div>
    );
};