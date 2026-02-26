"use client";

import { useEffect, useState, useMemo } from "react";
import Table from "../../../components/Table";
import DeleteModal from "../../../components/DeleteModal";
import SearchInput from "../../../components/SearchInput";
import Pagination from "../../../components/Pagination";
import { useParams, useRouter } from "next/navigation";

import {
  fetchEventsByOrganizationIdApi,
  deleteEventApi,
} from "../../../../../lib/apiClient";
import { 
  ALL_LC, 
  BTN_BACK, 
  COLUMNS_KEY_EVENT_ACTIONS, 
  COLUMNS_KEY_EVENT_DATA, 
  COLUMNS_KEY_MODE, 
  COLUMNS_KEY_SNO, 
  COLUMNS_KEY_STATUS, 
  COLUMNS_KEY_TITLE, 
  EVENT_MODE, 
  EVENT_STATUSS, 
  LABELS_ACTIONS, 
  LABELS_DATE, 
  LABELS_EVENT_NAME, 
  LABELS_PAST, 
  LABELS_S_NO, 
  LABELS_UPCOMING, 
  OFFLINE, 
  ONLINE, 
  PLACEHOLDER_SEARCH, 
} from "../../../../../constants/config-message";

export default function OrgEvents() {
  const { orgId } = useParams();
  const router = useRouter();

  const [tab, setTab] = useState(ALL_LC);
  const [allEvents, setAllEvents] = useState([]);
  const [orgInfo, setOrgInfo] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: COLUMNS_KEY_TITLE, direction: 'asc' });

  async function load() {
    setLoading(true);
    try {
      const res = await fetchEventsByOrganizationIdApi(orgId);
      const list = res.data?.data || [];
      if (list.length > 0) setOrgInfo(list[0].org || null);
      setAllEvents(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [orgId]);

  const filteredAndSortedEvents = useMemo(() => {
    let list = [...allEvents];

    // TAB FILTER
    if (tab === ONLINE) list = list.filter((e) => e.mode === ONLINE);
    if (tab === OFFLINE) list = list.filter((e) => e.mode === OFFLINE);
    if (tab === LABELS_UPCOMING)
      list = list.filter((e) => new Date(e.eventDate) >= new Date());
    if (tab === LABELS_PAST)
      list = list.filter((e) => new Date(e.eventDate) < new Date());

    // SEARCH
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.mode?.toLowerCase().includes(q) ||
          e.status?.toLowerCase().includes(q) ||
          e.categoryName?.toLowerCase().includes(q)
      );
    }

    // SORTING
    if (sortConfig.key) {
      list.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (typeof valA === 'string') {
          return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      });
    }

    return list;
  }, [allEvents, tab, search, sortConfig]);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedEvents.slice(start, start + itemsPerPage);
  }, [filteredAndSortedEvents, currentPage]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const columns = [
    { key: COLUMNS_KEY_SNO, label: LABELS_S_NO, sortable: false },
    { key: COLUMNS_KEY_TITLE, label: LABELS_EVENT_NAME, sortable: true },
    { key: "categoryName", label: "Category", sortable: true },
    { key: "modeBadge", label: EVENT_MODE, sortable: true },
    { key: "statusBadge", label: EVENT_STATUSS, sortable: true },
    { key: "dateDisplay", label: LABELS_DATE, sortable: true },
    { key: "engagement", label: "Engagement", sortable: false },
    { key: COLUMNS_KEY_EVENT_ACTIONS, label: LABELS_ACTIONS, sortable: false },
  ];

  const rows = paginatedEvents.map((item, i) => ({
    ...item,
    sno: (currentPage - 1) * itemsPerPage + i + 1,
    dateDisplay: (
      <div className="small">
        <div className="fw-bold">{new Date(item.eventDate).toLocaleDateString()}</div>
        <div className="text-muted">{item.eventTime}</div>
      </div>
    ),
    modeBadge: (
      <span className={`badge border ${item.mode === ONLINE ? 'border-primary text-primary' : 'border-dark text-dark'} rounded-pill px-3`}>
        <i className={`bi ${item.mode === ONLINE ? 'bi-globe' : 'bi-geo-alt'} me-1`}></i>
        {item.mode}
      </span>
    ),
    statusBadge: (
      <span className={`badge-pill ${item.status === 'APPROVED' ? 'bg-success' : item.status === 'REJECTED' ? 'bg-danger' : 'bg-warning'}`}>
        {item.status}
      </span>
    ),
    engagement: (
      <div className="d-flex gap-3 small text-muted fw-bold">
        <span><i className="bi bi-eye me-1"></i>{item.viewCount || 0}</span>
        <span><i className="bi bi-heart me-1 text-danger"></i>{item.likeCount || 0}</span>
      </div>
    ),
    actions: (
      <div className="d-flex gap-2">
        <button className="btn btn-sm btn-light shadow-sm text-primary" onClick={(e) => { e.stopPropagation(); router.push(`/admin/events/create?id=${item.identity}&orgId=${item.orgIdentity}`); }}>
          <i className="bi bi-pencil"></i>
        </button>
        <button className="btn btn-sm btn-light shadow-sm text-danger" onClick={(e) => { e.stopPropagation(); setDeleteItem(item); }}>
          <i className="bi bi-trash"></i>
        </button>
      </div>
    )
  }));

  return (
    <div className="container-fluid py-4 px-lg-4">
      {/* HEADER */}
      <div className="d-flex align-items-center mb-5">
        <button
          className="btn btn-white shadow-sm rounded-circle me-3 d-flex align-items-center justify-content-center hover-lift"
          style={{ width: '45px', height: '45px' }}
          onClick={() => router.push(`/admin/organizations/${orgId}`)}
        >
          <i className="bi bi-arrow-left fs-5"></i>
        </button>
        <div>
          <h2 className="fw-black text-dark m-0">Organization Events</h2>
          <p className="text-muted m-0 small">Events published by <span className="fw-bold text-primary">{orgInfo?.organizationName || orgId}</span></p>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="bg-white p-3 rounded-4 shadow-sm border mb-4 animate-fade-in">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="nav nav-pills custom-pills-sm bg-light p-1 rounded-3">
            {[ALL_LC, ONLINE, OFFLINE, LABELS_UPCOMING, LABELS_PAST].map((t) => (
              <button
                key={t}
                className={`nav-link border-0 small fw-bold text-uppercase px-3 py-1 ${tab === t ? 'active shadow-sm' : 'text-secondary'}`}
                onClick={() => { setTab(t); setCurrentPage(1); }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ minWidth: '300px' }}>
            <SearchInput
              value={search}
              onChange={(val) => { setSearch(val); setCurrentPage(1); }}
              placeholder="Search event title, status or mode..."
            />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-4 shadow-sm border overflow-hidden animate-fade-in-delayed">
        {loading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted fw-bold">Gathering events...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table
              columns={columns}
              rows={rows}
              sortConfig={sortConfig}
              onSort={handleSort}
              onRowClick={(r) => router.push(`/admin/events/${r.orgIdentity}/${r.identity}`)}
            />
            {rows.length === 0 && (
              <div className="p-5 text-center text-muted">
                <i className="bi bi-calendar-x fs-1 opacity-25 d-block mb-3"></i>
                No events found matching your current filters.
              </div>
            )}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {!loading && filteredAndSortedEvents.length > itemsPerPage && (
        <div className="mt-4 d-flex justify-content-center">
          <Pagination 
            page={currentPage} 
            total={filteredAndSortedEvents.length} 
            limit={itemsPerPage} 
            onChange={setCurrentPage} 
          />
        </div>
      )}

      {/* DELETE MODAL */}
      <DeleteModal
        item={deleteItem}
        confirmField="title"
        onClose={() => setDeleteItem(null)}
        onConfirm={async (item) => {
          await deleteEventApi(item.orgIdentity, item.identity);
          setDeleteItem(null);
          load();
        }}
      />

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .custom-pills-sm .nav-link {
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 0.65rem;
          letter-spacing: 0.05em;
        }
        .custom-pills-sm .nav-link.active {
          background-color: white;
          color: #4f46e5 !important;
        }
        .badge-pill {
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.65rem;
          color: white;
          letter-spacing: 0.05em;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease forwards; }
        .animate-fade-in-delayed { animation: fadeIn 0.4s ease 0.2s forwards; opacity: 0; }
        .hover-lift:hover {
          transform: scale(1.05);
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
  );
}
