import { useState, useEffect, useMemo } from "react";

// CSS
import "./UserDashboard.css";

// Services
import { fetchCreditApplications } from "@/services/creditService";;

// Components
import { NewLoanBtn } from "../CreateNewLoan/NewLoanBtn";
import Table from "@/components/Table/Table";
import SearchBar from "@/components/SearchBar/SearchBar";
import StatusBadge from "../../components/Table/StatusBadge";
import ActionsDropdown from "./ActionDropdown";
import { Pagination } from "../../components/Pagination/Pagination";
import { showError } from "../../services/toastService";

export default function UserDashboard() {
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loans, setLoans] = useState([]);
  const [company, setCompany] = useState(() => JSON.parse(sessionStorage.getItem("my-company")));
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem("user")));

  const loadCreditApplications = async (pageNumber = page) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await fetchCreditApplications(user.id, pageNumber, limit);
      setLoans(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching loans:", err);
      showError("Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreditApplications();
  }, [user, page, company]);


  const filteredData = useMemo(() => {
    if (!searchText && !dateFilter) return loans;
    const search = searchText.toLowerCase();
    return loans.filter((item) => {
      const dateStr = item.created_at?.split("T")[0] || "";
      return (
        (!searchText ||
          item.id.toLowerCase().includes(search) ||
          item.requested_amount?.toString().toLowerCase().includes(search) ||
          item.status?.toLowerCase().includes(search)) &&
        (!dateFilter || dateStr === dateFilter)
      );
    });
  }, [loans, searchText, dateFilter]);

  const columns = useMemo(
    () => [
      {
        key: "id",
        label: "ID Solicitud",
        render: (value) => <span className="fw-semibold">{value}</span>,
      },
      {
        key: "requested_amount",
        label: "Monto",
        render: (value) => `$${value}`,
        sortable: true,
      },
      {
        key: "status",
        label: "Estado",
        render: (value) => <StatusBadge status={value} />,
        sortable: true,
      },
      {
        key: "created_at",
        label: "Fecha",
        render: (value) => new Date(value).toLocaleDateString(),
        sortable: true,
      },
      {
        key: "acciones",
        label: "Acciones",
        render: (_, row) => (
          <ActionsDropdown
            row={row}
            company={company}
            onSuccess={() => loadCreditApplications(page)}
          />
        ),
      },
    ],
    [page]
  );

  return (
    <div className="container my-5">
      <div className="dashboard-header text-center mb-4 fw-bold">
        <h1>Bienvenido {user?.first_name}</h1>
      </div>

      <SearchBar
        placeholder="Buscar por ID, monto o estado..."
        value={searchText}
        onChange={setSearchText}
      />

      <div className="mb-4">
        <NewLoanBtn
          company={company || { legal_name: "" }}
          onSuccess={() => loadCreditApplications(page)}
        />
      </div>

      <h2 className="user_dashboard_loans my-4 ms-5">Mis Solicitudes</h2>

      {loading ? (
        <p className="text-center my-5">Cargando solicitudes...</p>
      ) : (
        <>
          <div className="table-wrapper mb-5 mx-auto">
            <Table columns={columns} data={filteredData} />
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}