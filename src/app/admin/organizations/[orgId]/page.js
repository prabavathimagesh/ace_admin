"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  fetchSingleOrganizationApi, 
  updateOrganizationApi, 
  deleteOrganizationApi 
} from "../../../../lib/apiClient";
import { 
  BTN_BACK, 
  EVENT_ADDRESS, 
  EVENT_DOMAIN_EMAIL, 
  LABELS_ACTIVE, 
  LABELS_INACTIVE, 
  LABELS_S_NO, 
  TITEL_ORGANIZATION 
} from "../../../../constants/config-message";

export default function OrganizationDetailPage() {
  const { orgId } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    load();
  }, [orgId]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchSingleOrganizationApi(orgId);
      setData(res.data?.data || res.data || null);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = async () => {
    if (!confirm(`Are you sure you want to ${data.isActive ? "deactivate" : "activate"} this organization?`)) return;
    setUpdating(true);
    try {
      await updateOrganizationApi(orgId, { isActive: !data.isActive });
      load();
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this organization? This will affect all associated events.")) return;
    setUpdating(true);
    try {
      await deleteOrganizationApi(orgId);
      router.push("/admin/organizations");
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

  if (!data) return <div className="p-5 text-center">Organization not found.</div>;

  return (
    <div className="container-fluid py-4 px-lg-5 bg-light min-vh-100">
      {/* HEADER & ACTIONS */}
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
            <h2 className="fw-black text-dark m-0">{data.organizationName}</h2>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 small text-muted">
                <li className="breadcrumb-item">Admin</li>
                <li className="breadcrumb-item">Organizations</li>
                <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '200px' }}>{orgId}</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="d-flex gap-2 w-100 w-md-auto justify-content-center">
          <button 
            className="btn btn-outline-primary px-4 rounded-3 d-flex align-items-center gap-2 shadow-sm"
            onClick={() => router.push(`/admin/organizations/create?id=${orgId}`)}
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>
          <button 
            className="btn btn-primary px-4 rounded-3 d-flex align-items-center gap-2 shadow-sm"
            onClick={() => router.push(`/admin/organizations/${orgId}/events`)}
          >
            <i className="bi bi-calendar-event"></i> View Events
          </button>
          <button 
            className={`btn px-4 rounded-3 shadow-sm d-flex align-items-center gap-2 ${data.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
            onClick={handleToggleActive}
            disabled={updating}
          >
            <i className={`bi ${data.isActive ? 'bi-lock' : 'bi-unlock'}`}></i>
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
                src={data.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.organizationName)}&background=4f46e5&color=fff&size=128`} 
                className="rounded-circle shadow-md border border-4 border-white" 
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                alt="Org Logo"
              />
              {data.isVerified && (
                <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 shadow-sm">
                  <i className="bi bi-patch-check-fill text-primary fs-4"></i>
                </div>
              )}
            </div>

            <h3 className="fw-black text-dark mb-1">{data.organizationName}</h3>
            <p className="text-muted small mb-4">{data.domainEmail}</p>

            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
              <span className={`badge-pill ${data.isActive ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                {data.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
              {data.isVerified && <span className="badge-pill bg-primary text-white">VERIFIED</span>}
              {data.isDeleted && <span className="badge-pill bg-danger text-white">DELETED</span>}
            </div>

            <div className="row g-2 text-start small">
              <div className="col-12 p-3 bg-light rounded-4 mb-2">
                <div className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.65rem' }}>Category</div>
                <div className="fw-bold text-dark">{data.organizationCategory || 'Not Available'}</div>
              </div>
              <div className="col-12 p-3 bg-light rounded-4">
                <div className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.65rem' }}>Website</div>
                <div className="fw-bold">
                  {data.website ? (
                    <a href={data.website} target="_blank" rel="noreferrer" className="text-primary text-decoration-none">
                      {data.website} <i className="bi bi-box-arrow-up-right small"></i>
                    </a>
                  ) : 'Not Available'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-4 shadow-sm border p-4">
            <h6 className="text-secondary fw-bold small text-uppercase mb-4">Quick Stats</h6>
            <div className="text-center">
              <div className="display-4 fw-black text-primary mb-1">
                {data.eventCount || 0}
              </div>
              <div className="text-muted fw-bold text-uppercase small">Events Hosted</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED INFO */}
        <div className="col-lg-8">
          <div className="row g-4">
            {/* PROFILE INFO SECTION */}
            <div className="col-12">
              <div className="bg-white p-4 rounded-4 shadow-sm border animate-fade-in">
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-primary">
                  <i className="bi bi-info-circle me-2"></i> Organization Profile
                </h5>
                <div className="row g-4">
                  <InfoBlock label="Identify / UUID" value={data.identity} icon="bi-fingerprint" col="12" />
                  <InfoBlock label="Email Address" value={data.domainEmail} icon="bi-envelope" />
                  <InfoBlock label="Organization Name" value={data.organizationName} icon="bi-building" />
                  <InfoBlock label="City" value={data.city} icon="bi-geo-alt" />
                  <InfoBlock label="State" value={data.state} icon="bi-map" />
                  <InfoBlock label="Country" value={data.country} icon="bi-globe" />
                  <InfoBlock label="Category" value={data.organizationCategory} icon="bi-grid" />
                </div>
              </div>
            </div>

            {/* ACCOUNT STATUS SECTION */}
            <div className="col-12">
              <div className="bg-white p-4 rounded-4 shadow-sm border animate-fade-in">
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-warning">
                  <i className="bi bi-shield-lock me-2"></i> Account & Security
                </h5>
                <div className="row g-4">
                  <InfoBlock label="Verified Status" value={data.isVerified ? 'Verified' : 'Unverified'} icon="bi-patch-check" color={data.isVerified ? 'text-success' : 'text-danger'} />
                  <InfoBlock label="Account Role ID" value={data.roleId || 2} icon="bi-person-badge" />
                  <InfoBlock label="Admin Created" value={data.isAdminCreated ? 'Yes' : 'No'} icon="bi-person-plus" />
                  <InfoBlock label="Created By Admin" value={data.adminCreatedBy || 'Self-Registered'} icon="bi-person-workspace" />
                  <InfoBlock label="System Slug" value={data.slug} icon="bi-link-45deg" col="12" />
                </div>
              </div>
            </div>

            {/* ACTIVITY INFO SECTION */}
            <div className="col-12">
              <div className="bg-white p-4 rounded-4 shadow-sm border animate-fade-in">
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-success">
                  <i className="bi bi-activity me-2"></i> Activity & Logs
                </h5>
                <div className="row g-4">
                  <InfoBlock label="Created At" value={data.createdAt ? new Date(data.createdAt).toLocaleString() : 'Not Available'} icon="bi-calendar-plus" />
                  <InfoBlock label="Last Updated" value={data.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'Not Available'} icon="bi-pencil-square" />
                  <InfoBlock label="Last Login" value={data.lastLoginAt ? new Date(data.lastLoginAt).toLocaleString() : 'Never'} icon="bi-clock-history" />
                  <InfoBlock label="Last Login IP" value={data.lastLoginIp} icon="bi-pc-display" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .h-2 { height: 0.5rem; }
        .badge-pill {
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
}

function InfoBlock({ label, value, icon, color = "text-muted", col = "6" }) {
  return (
    <div className={`col-md-${col}`}>
      <div className="p-3 border rounded-4 bg-light h-100 transition-all hover-lift">
        <div className="d-flex align-items-center gap-2 mb-2">
          <i className={`bi ${icon} ${color}`}></i>
          <span className="text-muted small fw-bold text-uppercase" style={{ letterSpacing: '0.02em', fontSize: '0.7rem' }}>{label}</span>
        </div>
        <div className="fw-bold text-dark text-break">{value === null || value === undefined ? "Not Available" : String(value)}</div>
      </div>
    </div>
  );
}
