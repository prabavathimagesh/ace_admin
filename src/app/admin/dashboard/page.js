"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardChart from "../components/DashboardChart";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import FullDetailModal from "../components/FullDetailModal";

import {
  fetchOrganizationsApi,
  fetchEventsApi,
  fetchUsersApi,
} from "../../../lib/apiClient";

import {
  APPROVED,
  CONDITION_BG_LIGHT,
  CONDITION_EVENT,
  CONDITION_OFFLINE,
  CONDITION_ONLINE,
  DRAFT,
  LABELS_ACTIVE,
  LABELS_APPROVED,
  LABELS_DELETED,
  LABELS_DRAFT,
  LABELS_INACTIVE,
  LABELS_PENDING,
  LABELS_REJECTED,
  LABELS_VERIFIED,
  PENDING,
  REJECTED,
  ROLE_ORGANIZATION,
  ROLE_USER,
  SIDEBAR_DASHBOARD,
  SIDEBAR_EVENTS,
  SIDEBAR_ORGANIZATIONS,
  SIDEBAR_USERS,
  TITEL_ACTIVE_ORGANIZATIONS,
  TITEL_ACTIVEUSERS,
  TITEL_DELETED_ORGANIZATIONS,
  TITEL_DELETED_USERS,
  TITEL_INACTIVE_ORGANIZATIONS,
  TITEL_INACTIVE_USERS,
  TITEL_OFFLINE_EVENTS,
  TITEL_ONLINE_EVENTS,
  TITEL_PAST_EVENTS,
  TITEL_REGISTERED_EVENTS,
  TITEL_UPCOMING_EVENTS,
  TITEL_VERIFIED_ORGANIZATIONS,
  COLUMNS_KEY_SNO,
  LABELS_S_NO,
  COLUMNS_KEY_ORGANIZATION_NAME,
  LABELS_NAME,
  COLUMNS_KEY_DOMAIN_EMAIL,
  EVENT_EMAIL,
  EVENT_CITY_LC,
  EVENT_CITY,
  COLUMNS_KEY_TITLE,
  LABELS_EVENT_NAME,
  COLUMNS_KEY_EVENT_DATA,
  LABELS_DATE,
  COLUMNS_KEY_MODE,
  EVENT_MODE,
  COLUMNS_KEY_STATUS,
  EVENT_STATUS,
} from "../../../constants/config-message";

export default function DashboardPage() {
  const [activeView, setActiveView] = useState(ROLE_ORGANIZATION);

  const [orgs, setOrgs] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Detail Modal State
  const [detailItem, setDetailItem] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [o, e, u] = await Promise.all([
        fetchOrganizationsApi(),
        fetchEventsApi(),
        fetchUsersApi()
      ]);
      
      // ✅ Handle both direct array and paginated response structures
      const extractList = (res) => {
        const payload = res?.data?.data;
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.data)) return payload.data;
        return [];
      };

      setOrgs(extractList(o));
      setEvents(extractList(e));
      setUsers(extractList(u));
    } finally {
      setLoading(false);
    }
  }

  // ================= DATA LOGIC =================
  const paginatedData = useMemo(() => {
    let list = [];
    if (activeView === ROLE_ORGANIZATION) list = orgs;
    if (activeView === CONDITION_EVENT) list = events;
    if (activeView === ROLE_USER) list = users;

    const start = (currentPage - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  }, [activeView, orgs, events, users, currentPage]);

  const totalItems = useMemo(() => {
    if (activeView === ROLE_ORGANIZATION) return orgs.length;
    if (activeView === CONDITION_EVENT) return events.length;
    if (activeView === ROLE_USER) return users.length;
    return 0;
  }, [activeView, orgs.length, events.length, users.length]);

  // ================= COLUMN DEFINITIONS =================
  const orgColumns = [
    { key: COLUMNS_KEY_SNO, label: LABELS_S_NO },
    { key: COLUMNS_KEY_ORGANIZATION_NAME, label: LABELS_NAME },
    { key: COLUMNS_KEY_DOMAIN_EMAIL, label: EVENT_EMAIL },
    { key: 'rank', label: 'Rank' },
    { key: 'eventCount', label: 'Events' },
    { key: 'status', label: 'Status' },
  ];

  const eventColumns = [
    { key: COLUMNS_KEY_SNO, label: LABELS_S_NO },
    { key: COLUMNS_KEY_TITLE, label: LABELS_EVENT_NAME },
    { key: COLUMNS_KEY_EVENT_DATA, label: LABELS_DATE },
    { key: COLUMNS_KEY_MODE, label: EVENT_MODE },
    { key: COLUMNS_KEY_STATUS, label: EVENT_STATUS },
    { key: 'viewCount', label: 'Views' },
  ];

  const userColumns = [
    { key: COLUMNS_KEY_SNO, label: LABELS_S_NO },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
  ];

  // ================= ROW RENDERING =================
  const rows = paginatedData.map((item, idx) => {
    const base = {
      ...item,
      sno: (currentPage - 1) * itemsPerPage + idx + 1,
    };

    if (activeView === ROLE_ORGANIZATION) {
      return {
        ...base,
        status: (
          <span className={`badge-pill ${item.isVerified ? 'badge-verified' : 'badge-not-verified'}`}>
            {item.isVerified ? 'Verified' : 'Unverified'}
          </span>
        )
      };
    }

    if (activeView === CONDITION_EVENT) {
      return {
        ...base,
        viewCount: item.viewCount || 0,
        status: (
          <span className={`badge-pill bg-light text-dark shadow-sm`}>
            {item.status}
          </span>
        )
      };
    }

    if (activeView === ROLE_USER) {
      return {
        ...base,
        status: (
          <span className={`badge-pill ${item.isActive ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
            {item.isActive ? 'Active' : 'Inactive'}
          </span>
        )
      };
    }

    return base;
  });

  // ================= ORG COUNTS =================
  const orgActive = orgs.filter((o) => o.isActive && !o.isDeleted).length;
  const orgInactive = orgs.filter((o) => !o.isActive && !o.isDeleted).length;
  const orgDeleted = orgs.filter((o) => o.isDeleted).length;
  const orgVerified = orgs.filter((o) => o.isVerified).length;

  // ================= EVENT COUNTS =================
  const approved = events.filter((e) => e.status === APPROVED).length;
  const pending = events.filter((e) => e.status === PENDING).length;
  const rejected = events.filter((e) => e.status === REJECTED).length;
  const draft = events.filter((e) => e.status === DRAFT).length;
  const upcoming = events.filter((e) => new Date(e.eventDate) >= new Date()).length;
  const past = events.filter((e) => new Date(e.eventDate) < new Date()).length;

  // ================= USER COUNTS =================
  const userActive = users.filter((u) => u.isActive && !u.isDeleted).length;
  const userInactive = users.filter((u) => !u.isActive && !u.isDeleted).length;
  const userDeleted = users.filter((u) => u.isDeleted).length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary shadow-sm" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-5 d-flex justify-content-between align-items-end">
        <div>
          <h2 className="fw-bold text-dark m-0">{SIDEBAR_DASHBOARD}</h2>
          <p className="text-muted m-0">Consolidated analytics and real-time management.</p>
        </div>
        <div className="bg-white rounded-pill px-3 py-2 shadow-sm border small fw-medium">
          <i className="bi bi-clock me-2"></i> Last Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* TOP BOXES */}
      <div className="row g-4 mb-5">
        <TopStatBox 
          title={SIDEBAR_ORGANIZATIONS} 
          value={orgs.length} 
          icon="bi-building" 
          active={activeView === ROLE_ORGANIZATION}
          onClick={() => { setActiveView(ROLE_ORGANIZATION); setCurrentPage(1); }}
          color="#6366f1"
          subtitle={`${orgActive} Active • ${orgVerified} Verified`}
        />
        <TopStatBox 
          title={SIDEBAR_EVENTS} 
          value={events.length} 
          icon="bi-calendar-event" 
          active={activeView === CONDITION_EVENT}
          onClick={() => { setActiveView(CONDITION_EVENT); setCurrentPage(1); }}
          color="#a855f7"
          subtitle={`${upcoming} Upcoming • ${approved} Approved`}
        />
        <TopStatBox 
          title={SIDEBAR_USERS} 
          value={users.length} 
          icon="bi-people" 
          active={activeView === ROLE_USER}
          onClick={() => { setActiveView(ROLE_USER); setCurrentPage(1); }}
          color="#f59e0b"
          subtitle={`${userActive} Active Users`}
        />
      </div>

      <div className="row g-4">
        {/* CHART SECTION */}
        <div className="col-lg-7">
          <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0">Metrics Spectrum</h5>
              <div className="small text-muted text-uppercase fw-bold letter-spacing-1">{activeView}</div>
            </div>
            {activeView === ROLE_ORGANIZATION && (
              <DashboardChart
                label="Organizations"
                labels={[LABELS_ACTIVE, LABELS_INACTIVE, LABELS_DELETED, LABELS_VERIFIED]}
                data={[orgActive, orgInactive, orgDeleted, orgVerified]}
              />
            )}
            {activeView === CONDITION_EVENT && (
              <DashboardChart
                label={SIDEBAR_EVENTS}
                labels={[LABELS_APPROVED, LABELS_PENDING, LABELS_REJECTED, LABELS_DRAFT]}
                data={[approved, pending, rejected, draft]}
              />
            )}
            {activeView === ROLE_USER && (
              <DashboardChart
                label={SIDEBAR_USERS}
                labels={[LABELS_ACTIVE, LABELS_INACTIVE, LABELS_DELETED]}
                data={[userActive, userInactive, userDeleted]}
              />
            )}
          </div>
        </div>

        {/* QUICK STATS SECTION */}
        <div className="col-lg-5">
          <div className="row g-3">
            {activeView === ROLE_ORGANIZATION && (
              <>
                <DetailBox title={TITEL_ACTIVE_ORGANIZATIONS} value={orgActive} icon="bi-check-circle" color="text-success" />
                <DetailBox title={TITEL_INACTIVE_ORGANIZATIONS} value={orgInactive} icon="bi-pause-circle" color="text-warning" />
                <DetailBox title={TITEL_DELETED_ORGANIZATIONS} value={orgDeleted} icon="bi-trash" color="text-danger" />
                <DetailBox title={TITEL_VERIFIED_ORGANIZATIONS} value={orgVerified} icon="bi-patch-check" color="text-info" />
              </>
            )}
            {activeView === CONDITION_EVENT && (
              <>
                <DetailBox title={TITEL_UPCOMING_EVENTS} value={upcoming} icon="bi-calendar-plus" color="text-primary" />
                <DetailBox title={TITEL_PAST_EVENTS} value={past} icon="bi-calendar-x" color="text-secondary" />
                <DetailBox title={TITEL_ONLINE_EVENTS} value={events.filter((e) => e.mode === CONDITION_ONLINE).length} icon="bi-laptop" color="text-info" />
                <DetailBox title={TITEL_OFFLINE_EVENTS} value={events.filter((e) => e.mode === CONDITION_OFFLINE).length} icon="bi-geo-alt" color="text-danger" />
              </>
            )}
            {activeView === ROLE_USER && (
              <>
                <DetailBox title={TITEL_ACTIVEUSERS} value={userActive} icon="bi-person-check" color="text-success" />
                <DetailBox title={TITEL_INACTIVE_USERS} value={userInactive} icon="bi-person-dash" color="text-warning" />
                <DetailBox title={TITEL_DELETED_USERS} value={userDeleted} icon="bi-person-x" color="text-danger" />
                <DetailBox title={TITEL_REGISTERED_EVENTS} value={events.length} icon="bi-journal-check" color="text-primary" />
              </>
            )}
          </div>
        </div>

        {/* DETAILED DATA TABLE */}
        <div className="col-12">
          <div className="bg-white p-4 rounded-4 shadow-sm border">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0">Recent {activeView === ROLE_ORGANIZATION ? 'Organizations' : activeView === CONDITION_EVENT ? 'Events' : 'Users'}</h5>
              <div className="small text-muted">Total {totalItems} items found</div>
            </div>
            
            <Table
              columns={activeView === ROLE_ORGANIZATION ? orgColumns : activeView === CONDITION_EVENT ? eventColumns : userColumns}
              rows={rows}
              onRowClick={(r) => setDetailItem({ item: r, type: activeView })}
            />

            <div className="mt-4">
              <Pagination 
                page={currentPage}
                total={totalItems}
                limit={itemsPerPage}
                onChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FULL DETAIL MODAL */}
      <FullDetailModal 
        show={!!detailItem}
        item={detailItem?.item}
        type={detailItem?.type}
        onClose={() => setDetailItem(null)}
      />
    </div>
  );
}

function TopStatBox({ title, value, icon, active, onClick, color, subtitle }) {
  return (
    <div className="col-md-4">
      <div 
        className={`p-4 rounded-4 border transition-all cursor-pointer h-100 ${active ? 'bg-white shadow-lg border-2' : 'bg-white shadow-sm opacity-85'}`}
        onClick={onClick}
        style={{ 
          borderColor: active ? color : '#e5e7eb',
          transform: active ? 'translateY(-8px)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex flex-column">
            <span className="text-secondary fw-bold small text-uppercase mb-1" style={{ letterSpacing: '0.05em' }}>{title}</span>
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{subtitle}</span>
          </div>
          <div className="rounded-4 p-3 d-flex align-items-center justify-content-center shadow-sm" style={{ backgroundColor: `${color}20` }}>
            <i className={`bi ${icon} fs-3`} style={{ color }}></i>
          </div>
        </div>
        <h2 className="fw-black m-0" style={{ fontSize: '2.5rem' }}>{value}</h2>
      </div>
    </div>
  );
}

function DetailBox({ title, value, icon, color }) {
  return (
    <div className="col-12">
      <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center hover-lift transition-all">
        <div className={`fs-3 me-3 ${color} bg-light p-2 rounded-3`}>
          <i className={`bi ${icon}`}></i>
        </div>
        <div>
          <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>{title}</div>
          <div className="fw-black fs-4">{value}</div>
        </div>
      </div>
    </div>
  );
}
