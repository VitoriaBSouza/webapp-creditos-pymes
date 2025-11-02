import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// CSS
import './UserDashboard.css';

// Services
import { fetchCreditApplications } from '../../services/creditService';
import companyServices from '../../services/companyServices';

// Components
import Table from '@/components/Table/Table';
import SearchBar from '@/components/SearchBar/SearchBar';
import { Pagination } from "../../components/Pagination/Pagination";
import StatusBadge from '../../components/Table/StatusBadge';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faCircleExclamation, faEye } from '@fortawesome/free-solid-svg-icons';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const user = JSON.parse(localStorage.getItem('sb-user'));

  // Cargar todas las empresas (o suficiente para los préstamos)
  const loadCompanies = async () => {
    try {
      const data = await companyServices.getCompanies({ page: 1, limit: 100 });
      return data?.items || [];
    } catch (err) {
      console.error("Error fetching companies:", err);
      return [];
    }
  };

  const loadCreditApplicationsWithCompanies = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const [loans, companies] = await Promise.all([
        fetchCreditApplications(null, pageNumber, limit),
        loadCompanies()
      ]);

      const mappedLoans = (loans?.items || []).map(loan => {
        const company = companies.find(c => c.id === loan.company_id);
        return { ...loan, legal_name: company?.legal_name || '—' };
      });

      setSolicitudes(mappedLoans);
      setTotalPages(loans?.totalPages || 1);
      setLimit(loans?.perPage || limit);
    } catch (err) {
      console.error("Error fetching credit applications or companies:", err);
      setSolicitudes([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreditApplicationsWithCompanies(page);
  }, [page]);

  // Filtrar por status y búsqueda
  const validStatuses = ['pending', 'approved', 'rejected', 'in_review'];
  const filteredData = solicitudes
    .filter(item => validStatuses.includes(item.status.toLowerCase()))
    .filter(item => {
      const search = searchText.toLowerCase();
      return (
        item.legal_name?.toLowerCase().includes(search) ||
        item.id.toLowerCase().includes(search) ||
        item.applicant_name?.toLowerCase().includes(search) ||
        item.requested_amount?.toString().toLowerCase().includes(search) ||
        item.status?.toLowerCase().includes(search) ||
        item.created_at?.toLowerCase().includes(search)
      );
    });

  // Renderers
  const renderText = (value) => value;
  const renderId = (value) => <span className="fw-semibold">## {value}</span>;
  const renderAmount = (value) => `$${value}`;

  const renderVerification = (value, item) => {
    const getIcon = (status) => {
      switch (status.toLowerCase()) {
        case 'approved':
          return <FontAwesomeIcon icon={faCircleCheck} className="text-success me-2" title="Aprobado" />;
        case 'rejected':
          return <FontAwesomeIcon icon={faCircleXmark} className="text-danger me-2" title="Rechazado" />;
        default:
          return <FontAwesomeIcon icon={faCircleExclamation} className="text-warning me-2" title="Pendiente" />;
      }
    };

    return (
      <div className="d-flex justify-content-center align-items-center gap-2">
        {getIcon(item.status)}
        <FontAwesomeIcon
          icon={faEye}
          className="text-dark cursor-pointer"
          title="Ver detalles"
          onClick={() => navigate(`/partner/loan-details/${item.id}`)}
        />
      </div>
    );
  };

  const columns = [
    { key: 'legal_name', label: 'Solicitante', render: renderText, sortable: true },
    { key: 'id', label: 'Solicitud', render: renderId, sortable: true },
    { key: 'requested_amount', label: 'Monto', render: renderAmount, sortable: true },
    { key: 'status', label: 'Estado', render: value => <StatusBadge status={value} />, sortable: true },
    { key: 'created_at', label: 'Fecha de Creación', render: renderText, sortable: true },
    {
      key: 'Más detalles',
      label: 'Más detalles',
      headerClassName: 'text-center',
      cellClassName: 'text-center',
      render: renderVerification,
      sortable: false
    }
  ];

  if (loading) return <p className="text-center my-5">Cargando solicitudes...</p>;

  return (
    <div className="container my-5">
      <div className="dashboard-header text-center mb-4 fw-bold">
        <h1>Bienvenido {user?.first_name}</h1>
      </div>

      <SearchBar
        placeholder="Buscar por solicitante, ID, monto, estado o fecha..."
        value={searchText}
        onChange={setSearchText}
      />

      <h2 className="user_dashboard_loans my-4 ms-5 ps-5">Solicitudes de crédito</h2>

      <Table columns={columns} data={filteredData} />

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  );
}