"use client";

import { useEffect, useState, useMemo } from "react";
import Table from "../components/Table";
import DeleteModal from "../components/DeleteModal";
import SearchInput from "../components/SearchInput";
import Pagination from "../components/Pagination";
import { useRouter } from "next/navigation";

import {
  fetchOrganizationsApi,
  deleteOrganizationApi,
} from "../../../lib/apiClient";
import { 
  COLUMNS_KEY_DOMAIN_EMAIL, 
  COLUMNS_KEY_EVENT_ACTIONS, 
  COLUMNS_KEY_ORGANIZATION_NAME, 
  COLUMNS_KEY_SNO, 
  CONDITION_ACTIVE, 
  CONDITION_CREATE_ORGANIZATION, 
  CONDITION_INACTIVE, 
  CONDITION_TRASH, 
  EVENT_CITY, 
  EVENT_CITY_LC, 
  EVENT_COUNTRY, 
  EVENT_EMAIL, 
  LABELS_ACTIONS, 
  LABELS_NAME, 
  LABELS_S_NO, 
  PLACEHOLDER_SEARCH, 
  ROUTER_ADMIN_ORGANIZATIONS_CREATE, 
  TITEL_ORGANIZATION_LIST, 
  EVENT_COUNTRY_LC,
  LABELS_VERIFIED
} from "../../../constants/config-message";

export default function OrganizationPage() {
  const [tab, setTab] = useState(CONDITION_ACTIVE);
  const [allData, setAllData] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: COLUMNS_KEY_ORGANIZATION_NAME, direction: 'asc' });

  const router = useRouter();

  async function load() {
    setLoading(true);
    const res = await fetchOrganizationsApi();
    const list = res.data?.data || [];
    setAllData(list);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // Filter and Sort Data
  const filteredAndSortedData = useMemo(() => {
    let list = [...allData];

    // TAB FILTER
    if (tab === CONDITION_ACTIVE) list = list.filter((o) => o.isActive && !o.isDeleted);
    if (tab === CONDITION_INACTIVE) list = list.filter((o) => !o.isActive && !o.isDeleted);
    if (tab === CONDITION_TRASH) list = list.filter((o) => o.isDeleted);

    // SEARCH FILTER
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.organizationName?.toLowerCase().includes(q) ||
          o.domainEmail?.toLowerCase().includes(q) ||
          o.city?.toLowerCase().includes(q) ||
          o.country?.toLowerCase().includes(q)
      );
    }

    // SORTING
    if (sortConfig.key) {
      list.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        
        if (typeof valA === 'string') {
          return sortConfig.direction === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        }
        
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      });
    }

    return list;
  }, [allData, tab, search, sortConfig]);

  // PAGINATION LOGIC
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const columns = [
    { key: COLUMNS_KEY_SNO, label: LABELS_S_NO, sortable: false },
    { key: COLUMNS_KEY_ORGANIZATION_NAME, label: LABELS_NAME, sortable: true },
    { key: COLUMNS_KEY_DOMAIN_EMAIL, label: EVENT_EMAIL, sortable: true },
    { key: EVENT_CITY_LC, label: EVENT_CITY, sortable: true },
    { key: 'rank', label: 'Rank', sortable: true },
    { key: 'eventCount', label: 'Events', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
    { key: COLUMNS_KEY_EVENT_ACTIONS, label: LABELS_ACTIONS, sortable: false },
  ];

  const rows = paginatedData.map((o, index) => ({
    ...o,
    sno: (currentPage - 1) * itemsPerPage + index + 1,
    rank: o.rank || "-",
    eventCount: o.eventCount || 0,
    status: (
      <span className={`badge-pill ${o.isVerified ? 'badge-verified' : 'badge-not-verified'}`}>
        {o.isVerified ? 'Verified' : 'Not Verified'}
      </span>
    )
  }));

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">{TITEL_ORGANIZATION_LIST}</h2>
        <button
          className="btn btn-primary px-4 shadow-sm"
          onClick={() => router.push(ROUTER_ADMIN_ORGANIZATIONS_CREATE)}
          style={{ borderRadius: '8px' }}
        >
          <i className="bi bi-plus-lg me-2"></i>
          {CONDITION_CREATE_ORGANIZATION}
        </button>
      </div>

      {/* TABS */}
      <ul className="nav nav-pills mb-4 bg-white p-1 rounded shadow-sm d-inline-flex border">
        {[CONDITION_ACTIVE, CONDITION_INACTIVE, CONDITION_TRASH].map((t) => (
          <li key={t} className="nav-item">
            <button
              className={`nav-link px-4 py-2 ${tab === t ? 'active bg-primary' : 'text-muted'}`}
              onClick={() => {
                setTab(t);
                setCurrentPage(1);
              }}
              style={{ borderRadius: '6px', transition: 'all 0.2s' }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded shadow-sm border mb-4">
        <div className="row align-items-center">
          <div className="col-md-6">
            <SearchInput
              value={search}
              onChange={(val) => {
                setSearch(val);
                setCurrentPage(1);
              }}
              placeholder={PLACEHOLDER_SEARCH}
            />
          </div>
          <div className="col-md-6 text-end">
             <span className="text-muted small">Total: {filteredAndSortedData.length} Organizations</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            rows={rows}
            sortConfig={sortConfig}
            onSort={handleSort}
            onRowClick={(r) =>
              router.push(`/admin/organizations/${r.identity}`)
            }
            onEdit={(r) =>
              router.push(`/admin/organizations/create?id=${r.identity}`)
            }
            onDelete={(r) => setDeleteItem(r)}
          />

          {/* PAGINATION */}
          <div className="mt-4">
            <Pagination 
              page={currentPage} 
              total={filteredAndSortedData.length} 
              limit={itemsPerPage} 
              onChange={setCurrentPage} 
            />
          </div>
        </>
      )}

      {/* DELETE MODAL */}
      <DeleteModal
        item={deleteItem}
        confirmField={COLUMNS_KEY_ORGANIZATION_NAME}
        onClose={() => setDeleteItem(null)}
        onConfirm={async (item) => {
          await deleteOrganizationApi(item.identity);
          setDeleteItem(null);
          load();
        }}
      />
    </div>
  );
}
