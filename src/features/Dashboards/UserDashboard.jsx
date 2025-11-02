import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//CSS
import './UserDashboard.css';

//components
import Table from '@/components/Table/Table';
import SearchBar from '@/components/SearchBar/SearchBar';
import { Pagination } from "../../components/Pagination/Pagination";

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faCircleExclamation, faEye } from '@fortawesome/free-solid-svg-icons';

import companyServices from '../../services/companyServices';
import { fetchCreditApplications } from '../../services/creditService';
import StatusBadge from '../../components/Table/StatusBadge';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const user = JSON.parse(localStorage.getItem('sb-user'));

  const loadCreditApplicationsWithCompanies = async (pageNumber = 1) => {
    setLoading(true);

    const storageKey = `loans-page-${pageNumber}`;
    const cached = sessionStorage.getItem(storageKey);
    if (cached) {
      setSolicitudes(JSON.parse(cached));
      setLoading(false);
      return;
    }

    try {
      // Traer préstamos
      const loansData = await fetchCreditApplications(null, pageNumber, limit);
      const loansPage = loansData?.items || [];

      const companyIds = [...new Set(loansPage.map(l => l.company_id))];

      const companiesMap = {};
      for (const id of companyIds) {
        const companyResp = await companyServices.getCompanyById(id); 
        if (companyResp) companiesMap[id] = companyResp.legal_name;
      }

      const mappedLoans = loansPage.map(loan => ({
        ...loan,
        legal_name: companiesMap[loan.company_id] || '—'
      }));

      setSolicitudes(mappedLoans);
      sessionStorage.setItem(storageKey, JSON.stringify(mappedLoans));
      setTotalPages(loansData?.totalPages || 1);

    } catch (err) {
      console.error("Error fetching loans or companies:", err);
      setSolicitudes([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreditApplicationsWithCompanies(page);
  }, [page]);

  // Filtrar por búsqueda
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

  // Renderers personalizados
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

  const userColumns = [
    { key: 'legal_name', label: 'Solicitante', render: renderText, sortable: true },
    { key: 'id', label: 'Solicitud', render: renderId, sortable: false },
    { key: 'requested_amount', label: 'Monto', render: renderAmount, sortable: true },
    { key: 'status', label: 'Estado', render: (value) => <StatusBadge status={value} />, sortable: true },
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

      <Table
              columns={user?.role === 'applicant' ? userColumns : null}
              data={filteredData}
            />

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}