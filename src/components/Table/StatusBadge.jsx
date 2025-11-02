import "../Table/Table.css";

export default function StatusBadge({ status }) {
    const getClass = (status) => {
        switch (status) {
            case "pending":
                return "badge-pendiente";
            case "approved":
                return "badge-aprobado";
            case "rejected":
                return "badge-rechazado";
            case "in_review":
                return "badge-in-review";
            default:
                return "badge-draft";
        }
    };

    const spanishStatus = (status) =>{

        if(status === "pending") return "Pendiente";
        if(status === "draft") return "Borrador";
        if(status === "approved") return "Aprobado";
        if (status === "rejected") return "Rechazado";
        if(status === "in_review") return "En Revisión"
    }

    return <span className={`badge badge_status px-1 ${getClass(status)}`}>{spanishStatus(status)}</span>;
}
