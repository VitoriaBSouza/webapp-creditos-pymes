import { useState } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

//CSS files
import "./Table.css";

export default function Table({ columns = [], data = [], className = "" }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const handleSort = (key, sortable) => {
    if (!sortable) return;
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "requested_amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortConfig.key === "created_at") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const sortedData = getSortedData();

  const renderSortIcon = (colKey) => {
    if (sortConfig.key !== colKey) return <FaSort className="sort-icon" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="sort-icon active" />
    ) : (
      <FaSortDown className="sort-icon active" />
    );
  };

  return (
    <div className={`card shadow-sm ${className}`}>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover table_custom_body mb-0">
            <thead className="table_header">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`ps-5 py-3 fw-bold fs-5 ${col.headerClassName || ""} ${
                      col.sortable !== false ? "sortable-header" : ""
                    }`}
                    onClick={() => handleSort(col.key, col.sortable !== false)}
                  >
                    <span className="d-flex align-items-center gap-2">
                      {col.label}
                      {col.sortable !== false && renderSortIcon(col.key)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 text-muted">
                    No hay datos disponibles
                  </td>
                </tr>
              ) : (
                sortedData.map((item) => (
                  <tr key={item.id}>
                    {columns.map((col) => (
                      <td key={col.key} className={`ps-5 ${col.cellClassName || ""}`}>
                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}