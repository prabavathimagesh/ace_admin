"use client";

import { useState, useEffect, useMemo } from "react";
import Table from "../components/Table";
import DeleteModal from "../components/DeleteModal";
import SearchInput from "../components/SearchInput";
import Pagination from "../components/Pagination";
import { useRouter } from "next/navigation";
import { fetchUsersApi, deleteUserApi, updateUserApi } from "../../../lib/apiClient";
import { 
  COLUMNS_KEY_SNO, 
  CONDITION_ACTIONS, 
  CONDITION_ACTIVE, 
  CONDITION_TRASH, 
  CONFIRM_FIELD_EMAIL, 
  EVENT_EMAIL, 
  EVENT_STATUS, 
  LABELS_ACTIONS, 
  LABELS_ACTIVE, 
  LABELS_DELETED, 
  LABELS_INACTIVE, 
  LABELS_NAME, 
  LABELS_S_NO, 
  PHONE_NUMBER, 
  PLACEHOLDER_SEARCH, 
  TITEL_CREATE_USER, 
  TITEL_USERS_LIST 
} from "../../../constants/config-message";

export default function UsersPage() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [deleteItem, setDeleteItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const router = useRouter();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchUsersApi();
      // Handle nested paginated response
      const list = res.data?.data?.data || res.data?.data || [];
      setAllUsers(list);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = async (user) => {
    try {
      await updateUserApi(user.id, { isActive: !user.isActive });
      load();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const matchesSearch = 
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "ALL" || 
        (statusFilter === "ACTIVE" && u.isActive && !u.isDeleted) ||
        (statusFilter === "INACTIVE" && !u.isActive && !u.isDeleted) ||
        (statusFilter === "DELETED" && u.isDeleted);
      
      const matchesRole = 
        roleFilter === "ALL" || 
        String(u.roleId) === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [allUsers, search, statusFilter, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns = [
    { key: COLUMNS_KEY_SNO, label: LABELS_S_NO },
    { key: "name", label: LABELS_NAME },
    { key: "email", label: EVENT_EMAIL },
    { key: "phone", label: "Phone" },
    { key: "roleDisplay", label: "Role" },
    { key: "statusBadge", label: EVENT_STATUS },
    { key: "createdAtDisplay", label: "Joined Date" },
    { key: CONDITION_ACTIONS, label: LABELS_ACTIONS },
  ];

  const rows = paginatedUsers.map((u, index) => ({
    ...u,
    sno: (currentPage - 1) * itemsPerPage + index + 1,
    roleDisplay: <span className="fw-bold text-secondary">Role {u.roleId}</span>,
    createdAtDisplay: new Date(u.createdAt).toLocaleDateString(),
    statusBadge: (
      <span className={`badge-pill ${u.isDeleted ? 'bg-danger' : u.isActive ? 'bg-success' : 'bg-warning'}`}>
        {u.isDeleted ? 'DELETED' : u.isActive ? 'ACTIVE' : 'INACTIVE'}
      </span>
    ),
    actions: (
      <div className="d-flex gap-2">
        <button className="btn btn-sm btn-light shadow-sm" onClick={(e) => { e.stopPropagation(); handleToggleActive(u); }} title={u.isActive ? "Deactivate" : "Activate"}>
          <i className={`bi ${u.isActive ? 'bi-person-x' : 'bi-person-check'}`}></i>
        </button>
        <button className="btn btn-sm btn-light shadow-sm text-primary" onClick={(e) => { e.stopPropagation(); router.push(`/admin/users/create?id=${u.id}`); }} title="Edit">
          <i className="bi bi-pencil"></i>
        </button>
        <button className="btn btn-sm btn-light shadow-sm text-danger" onClick={(e) => { e.stopPropagation(); setDeleteItem(u); }} title="Delete">
          <i className="bi bi-trash"></i>
        </button>
      </div>
    )
  }));

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
        <div>
          <h2 className="fw-black m-0">{TITEL_USERS_LIST}</h2>
          <p className="text-muted mb-0">Manage system users, roles, and account permissions.</p>
        </div>
        <button className="btn btn-primary px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2" onClick={() => router.push("/admin/users/create")}>
          <i className="bi bi-person-plus-fill fs-5"></i>
          <span className="fw-bold">{TITEL_CREATE_USER}</span>
        </button>
      </div>

      {/* FILTERS SECTION */}
      <div className="bg-white p-3 rounded-4 shadow-sm border mb-4 animate-fade-in">
        <div className="row g-3 align-items-center">
          <div className="col-lg-4">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email..." />
          </div>
          <div className="col-md-4 col-lg-3">
            <select className="form-select border-0 bg-light rounded-3" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
              <option value="DELETED">Trash / Deleted</option>
            </select>
          </div>
          <div className="col-md-4 col-lg-3">
            <select className="form-select border-0 bg-light rounded-3" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="ALL">All Roles</option>
              <option value="1">Role 1 (Admin)</option>
              <option value="2">Role 2 (Organizer)</option>
              <option value="3">Role 3 (User)</option>
            </select>
          </div>
          <div className="col-md-4 col-lg-2 text-md-end">
            <button className="btn btn-light rounded-3 text-secondary w-100" onClick={() => { setSearch(""); setStatusFilter("ALL"); setRoleFilter("ALL"); }}>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-4 shadow-sm border overflow-hidden animate-fade-in-delayed">
        {loading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Fetching users...</p>
          </div>
        ) : (
          <div className="table-hover-container">
            <Table
              columns={columns}
              rows={rows}
              onRowClick={(u) => router.push(`/admin/users/${u.identity}`)}
            />
            {rows.length === 0 && (
              <div className="p-5 text-center text-muted">
                <i className="bi bi-people fs-1 d-block mb-3 opacity-25"></i>
                No users found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {!loading && filteredUsers.length > itemsPerPage && (
        <div className="mt-4 d-flex justify-content-center">
          <Pagination
            page={currentPage}
            total={filteredUsers.length}
            limit={itemsPerPage}
            onChange={setCurrentPage}
          />
        </div>
      )}

      {/* DELETE MODAL */}
      <DeleteModal
        item={deleteItem}
        confirmField="email"
        onClose={() => setDeleteItem(null)}
        onConfirm={async (item) => {
          await deleteUserApi(item.id);
          setDeleteItem(null);
          load();
        }}
      />

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .badge-pill {
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          color: white;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease forwards; }
        .animate-fade-in-delayed { animation: fadeIn 0.4s ease 0.2s forwards; opacity: 0; }
        .table-hover-container :global(tr) {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .table-hover-container :global(tr:hover) {
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
  );
}
