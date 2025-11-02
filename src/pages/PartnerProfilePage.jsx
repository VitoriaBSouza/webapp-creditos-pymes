import { useEffect, useState } from "react";

//features
import { ProfilePartnerForm } from "../features/ProfilePartners/ProfilePartnerForm";

//services
import userServices from "../services/userServices";

export const PartnerProfilePage = () => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem("user")));

    useEffect(() => {
        if (!user?.id) {
            userServices.getMyProfile()
                .then(profile => {
                    if (profile) {
                        sessionStorage.setItem("user", JSON.stringify(profile));
                        setUser(profile);
                        console.log(profile);
                    }
                })
                .catch(err => {
                    console.error("Error cargando perfil:", err);
                    showError("Error al cargar datos del perfil");
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) return <p className="text-center mt-5 fs-5">Cargando datos...</p>;

    return (
        <div className="container-fluid p-4">
            <h1 className="text-center my-4 partner_profile_title">Mi Perfil</h1>
            <ProfilePartnerForm
                operator={user}
            />
        </div>
    );
}