"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchUserByIdApi, updateUserApi, deleteUserApi } from "../../../../lib/apiClient";
import { 
  BTN_BACK, 
  EVENT_ATTENDED, 
  EVENT_EMAIL, 
  EVENT_REGISTERED, 
  FULL_NAME, 
  LABELS_ACTIVE, 
  LABELS_INACTIVE, 
  LOADING, 
  PHONE, 
  TABLE_NO_DATA, 
  TITEL_UPCOMING_EVENTS, 
  USER_DETAILS 
} from "../../../../constants/config-message";

export default function UserDetail() {
  const { identity } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    load();
  }, [identity]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchUserByIdApi(identity);
      setData(res.data?.data || null);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = async () => {
    if (!confirm(`Are you sure you want to ${data.isActive ? 'deactivate' : 'activate'} this user?`)) return;
    setUpdating(true);
    try {
      await updateUserApi(data.id, { isActive: !data.isActive });
      load();
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    setUpdating(true);
    try {
      await deleteUserApi(data.id);
      router.push("/admin/users");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary shadow-sm" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  if (!data) return <div className="p-5 text-center">User not found.</div>;

  return (
    <div className="container-fluid py-4 px-lg-5 bg-light min-vh-100">
      {/* TOP HEADER / ACTION BAR */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
            onClick={() => router.back()}
            style={{ width: '40px', height: '40px' }}
          >
            <i className="bi bi-arrow-left fs-5"></i>
          </button>
          <div>
            <h2 className="fw-black text-dark m-0">{USER_DETAILS}</h2>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 small text-muted">
                <li className="breadcrumb-item">Admin</li>
                <li className="breadcrumb-item">Users</li>
                <li className="breadcrumb-item active">{data.name}</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-primary px-4 rounded-3 d-flex align-items-center gap-2 shadow-sm"
            onClick={() => router.push(`/admin/users/create?id=${data.id}`)}
          >
            <i className="bi bi-pencil-square"></i> Edit Profile
          </button>
          <button 
            className={`btn px-4 rounded-3 shadow-sm d-flex align-items-center gap-2 ${data.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
            onClick={handleToggleActive}
            disabled={updating}
          >
            <i className={`bi ${data.isActive ? 'bi-person-dash' : 'bi-person-check'}`}></i>
            {data.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button 
            className="btn btn-outline-danger px-4 rounded-3 shadow-sm d-flex align-items-center gap-2"
            onClick={handleDelete}
            disabled={updating}
          >
            <i className="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN: PROFILE CARD */}
        <div className="col-lg-4">
          <div className="bg-white rounded-4 shadow-sm border p-4 text-center mb-4 position-relative overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 h-2 bg-primary"></div>
            
            <div className="my-4 position-relative d-inline-block">
              <img 
                src={data.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366f1&color=fff&size=128`} 
                className="rounded-circle shadow-md border border-4 border-white" 
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                alt="User Profile"
              />
              <div className={`position-absolute bottom-0 end-0 p-2 rounded-circle border border-2 border-white ${data.isActive ? 'bg-success' : 'bg-secondary'}`} style={{ width: '20px', height: '20px' }}></div>
            </div>

            <h3 className="fw-black text-dark mb-1">{data.name}</h3>
            <p className="text-muted small mb-4">{data.email}</p>

            <div className="row g-2 text-start small mb-4">
              <div className="col-12 p-3 bg-light rounded-4 border-start border-4 border-primary">
                <div className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.65rem' }}>Full Name</div>
                <div className="fw-bold">{data.name}</div>
              </div>
              <div className="col-12 p-3 bg-light rounded-4 border-start border-4 border-info">
                <div className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.65rem' }}>Email Address</div>
                <div className="fw-bold">{data.email}</div>
              </div>
              <div className="col-12 p-3 bg-light rounded-4 border-start border-4 border-warning">
                <div className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.65rem' }}>Phone Number</div>
                <div className="fw-bold">{data.phone || 'Not Available'}</div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center gap-2">
              <span className={`badge-pill ${data.isActive ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                {data.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
              {data.isDeleted && <span className="badge-pill bg-danger text-white">DELETED</span>}
              {data.isAdminCreated && <span className="badge-pill bg-indigo text-white">ADMIN CREATED</span>}
              <span className="badge-pill bg-dark text-white text-uppercase">Role: {data.roleId}</span>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4">
            <h6 className="text-secondary fw-bold small text-uppercase mb-4">Engagement Summary</h6>
            <div className="row g-3">
              <div className="col-4 text-center">
                <div className="text-primary fs-3 mb-1"><i className="bi bi-box-arrow-in-right"></i></div>
                <div className="fw-black fs-4">12</div>
                <div className="text-muted small">Reg.</div>
              </div>
              <div className="col-4 text-center border-start border-end">
                <div className="text-success fs-3 mb-1"><i className="bi bi-check2-all"></i></div>
                <div className="fw-black fs-4">8</div>
                <div className="text-muted small">Attended</div>
              </div>
              <div className="col-4 text-center">
                <div className="text-warning fs-3 mb-1"><i className="bi bi-calendar-event"></i></div>
                <div className="fw-black fs-4">4</div>
                <div className="text-muted small">Upcoming</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="col-lg-8">
          <div className="row g-4">
            {/* LOCATION INFO */}
            <div className="col-12">
              <div className="bg-white p-4 rounded-4 shadow-sm border animate-fade-in">
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-primary">
                  <i className="bi bi-geo-alt me-2"></i> Location Details
                </h5>
                <div className="row g-4">
                  <InfoBlock label="City" value={data.city} icon="bi-building" />
                  <InfoBlock label="State" value={data.state} icon="bi-map" />
                  <InfoBlock label="Country" value={data.country} icon="bi-globe" />
                  <InfoBlock label="User Identity" value={data.identity} icon="bi-fingerprint" />
                </div>
              </div>
            </div>

            {/* ACCOUNT & SOURCE INFO */}
            <div className="col-12">
              <div className="bg-white p-4 rounded-4 shadow-sm border animate-fade-in">
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-indigo">
                  <i className="bi bi-shield-lock me-2"></i> Account & Administrative Info
                </h5>
                <div className="row g-4">
                  <InfoBlock label="Role ID" value={data.roleId} icon="bi-person-badge" />
                  <InfoBlock label="Selected Type" value={data.hasSelectedType ? 'Yes' : 'No'} icon="bi-check2-circle" />
                  <InfoBlock label="Admin Created" value={data.isAdminCreated ? 'Yes' : 'No'} icon="bi-person-plus" />
                  <InfoBlock label="Created By" value={data.adminCreatedBy} icon="bi-person-workspace" />
                </div>
              </div>
            </div>

            {/* ACTIVITY INFO */}
            <div className="col-12">
              <div className="bg-white p-4 rounded-4 shadow-sm border animate-fade-in">
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-success">
                  <i className="bi bi-activity me-2"></i> System Activity Logs
                </h5>
                <div className="row g-4">
                  <InfoBlock label="Last Login" value={data.lastLoginAt ? new Date(data.lastLoginAt).toLocaleString() : 'Never'} icon="bi-clock-history" />
                  <InfoBlock label="Last Login IP" value={data.lastLoginIp} icon="bi-pc-display" />
                  <InfoBlock label="Account Created" value={new Date(data.createdAt).toLocaleString()} icon="bi-calendar-date" />
                  <InfoBlock label="Last Updated" value={new Date(data.updatedAt).toLocaleString()} icon="bi-pencil-fill" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .bg-indigo { background-color: #6366f1; }
        .text-indigo { color: #6366f1; }
        
        .badge-pill {
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }

        .bg-body-tertiary { background-color: #f8f9fa !important; }
        .h-2 { height: 0.5rem; }
      `}</style>
    </div>
  );
}

function InfoBlock({ label, value, icon, color = "text-muted", col = "6" }) {
  return (
    <div className={`col-md-${col}`}>
      <div className="p-3 border rounded-4 bg-light h-100">
        <div className="d-flex align-items-center gap-2 mb-2">
          <i className={`bi ${icon} ${color}`}></i>
          <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.02em', fontSize: '0.7rem' }}>{label}</span>
        </div>
        <div className="fw-bold text-dark text-break">{value === null || value === undefined ? "Not Available" : String(value)}</div>
      </div>
    </div>
  );
}
