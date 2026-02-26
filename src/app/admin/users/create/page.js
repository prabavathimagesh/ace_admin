"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  createUserApi, 
  updateUserApi, 
  fetchUserByIdApi 
} from "../../../../lib/apiClient";
import { 
  BTN_BACK, 
  CONDITION_CREATE_USER, 
  CONDITION_EDIT_USER, 
  CONDITION_UPDATES_USER, 
  EMAIL_ADDRESS, 
  EVENT_STATUSS, 
  FULL_NAME, 
  LABELS_ACTIVE, 
  LABELS_INACTIVE, 
  MSG_SOMETHING_WENT_WRONG, 
  PASSWORD, 
  PHONE, 
  SAVING 
} from "../../../../constants/config-message";

export default function UserFormPage() {
  const router = useRouter();
  const params = useSearchParams();

  const userId = params.get("id");
  const isEdit = Boolean(userId);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    state: "",
    country: "",
    roleId: 3,
    isActive: true,
  });

  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    async function loadUser() {
      if (!isEdit) return;
      try {
        const res = await fetchUserByIdApi(userId);
        const d = res.data?.data || res.data;
        if (d) {
          setForm({
            name: d.name || "",
            email: d.email || "",
            phone: d.phone || "",
            city: d.city || "",
            state: d.state || "",
            country: d.country || "",
            roleId: d.roleId || 3,
            isActive: d.isActive ?? true,
            password: "",
          });
        }
      } finally {
        setFetching(false);
      }
    }
    loadUser();
  }, [isEdit, userId]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password;

    try {
      const res = isEdit 
        ? await updateUserApi(userId, payload) 
        : await createUserApi(payload);

      if (res.status) {
        setMsg({ text: isEdit ? "User updated successfully!" : "User created successfully!", type: "success" });
        setTimeout(() => router.push("/admin/users"), 1000);
      } else {
        setMsg({ text: res.message || MSG_SOMETHING_WENT_WRONG, type: "danger" });
      }
    } catch (err) {
      setMsg({ text: "An error occurred. Please try again.", type: "danger" });
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary shadow-sm" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-lg-5 bg-light min-vh-100">
      <div className="d-flex align-items-center gap-3 mb-5">
        <button className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center" onClick={() => router.back()} style={{ width: '40px', height: '40px' }}>
          <i className="bi bi-arrow-left fs-5"></i>
        </button>
        <div>
          <h2 className="fw-black text-dark m-0">{isEdit ? CONDITION_EDIT_USER : CONDITION_CREATE_USER}</h2>
          <p className="text-muted small m-0">Fill in the details below to {isEdit ? 'update the' : 'register a new'} system user.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="row g-4 justify-content-center">
        <div className="col-lg-8">
          
          {msg.text && (
            <div className={`alert alert-${msg.type} rounded-4 shadow-sm border-0 mb-4 animate-fade-in`}>
              <i className={`bi ${msg.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
              {msg.text}
            </div>
          )}

          {/* BASIC INFORMATION SECTION */}
          <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
            <h5 className="fw-bold mb-4 text-primary border-bottom pb-2">
              <i className="bi bi-person-bounding-box me-2"></i> User Identity
            </h5>
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label small fw-bold text-muted text-uppercase">Full Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control rounded-3 py-2 px-3 border-light bg-light focus-shadow" value={form.name} required onChange={(e) => updateField("name", e.target.value)} placeholder="Enter full name" />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted text-uppercase">Email Address <span className="text-danger">*</span></label>
                <input type="email" className="form-control rounded-3 py-2 px-3 border-light bg-light focus-shadow" value={form.email} required onChange={(e) => updateField("email", e.target.value)} placeholder="name@example.com" />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted text-uppercase">Phone Number</label>
                <input type="text" className="form-control rounded-3 py-2 px-3 border-light bg-light focus-shadow" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 00000 00000" />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted text-uppercase">Password {isEdit && <small className="text-primary">(Leave empty to keep current)</small>}</label>
                <input type="password" className="form-control rounded-3 py-2 px-3 border-light bg-light focus-shadow" value={form.password} required={!isEdit} onChange={(e) => updateField("password", e.target.value)} placeholder="••••••••" />
              </div>
            </div>
          </div>

          {/* LOCATION SECTION */}
          <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
            <h5 className="fw-bold mb-4 text-indigo border-bottom pb-2">
              <i className="bi bi-geo-alt me-2"></i> Location Details
            </h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-bold text-muted text-uppercase">City</label>
                <input type="text" className="form-control rounded-3 py-2 px-3 border-light bg-light focus-shadow" value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="City" />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold text-muted text-uppercase">State</label>
                <input type="text" className="form-control rounded-3 py-2 px-3 border-light bg-light focus-shadow" value={form.state} onChange={(e) => updateField("state", e.target.value)} placeholder="State" />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Country</label>
                <input type="text" className="form-control rounded-3 py-2 px-3 border-light bg-light focus-shadow" value={form.country} onChange={(e) => updateField("country", e.target.value)} placeholder="Country" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* PERMISSIONS & STATUS SECTION */}
          <div className="bg-white p-4 rounded-4 shadow-sm border mb-4 position-sticky" style={{ top: '2rem' }}>
            <h5 className="fw-bold mb-4 text-warning border-bottom pb-2">
              <i className="bi bi-shield-lock me-2"></i> Role & Access
            </h5>
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted text-uppercase">User Role <span className="text-danger">*</span></label>
              <select className="form-select rounded-3 py-2 px-3 border-light bg-light focus-shadow" value={form.roleId} required onChange={(e) => updateField("roleId", parseInt(e.target.value))}>
                <option value="1">Role 1 (Administrator)</option>
                <option value="2">Role 2 (Organizer)</option>
                <option value="3">Role 3 (Standard User)</option>
              </select>
              <div className="form-text small mt-2">Roles define what actions the user can perform across the system.</div>
            </div>

            <div className="mb-4">
              <label className="form-label d-block small fw-bold text-muted text-uppercase mb-3">Account Status</label>
              <div className="d-flex gap-3">
                <div 
                  className={`flex-fill p-3 rounded-4 border text-center pointer transition-all ${form.isActive ? 'border-success bg-success-light text-success' : 'border-light bg-light text-muted opacity-50'}`}
                  onClick={() => updateField("isActive", true)}
                >
                  <i className="bi bi-check-circle-fill d-block fs-4 mb-1"></i>
                  <span className="fw-bold small">Active</span>
                </div>
                <div 
                  className={`flex-fill p-3 rounded-4 border text-center pointer transition-all ${!form.isActive ? 'border-danger bg-danger-light text-danger' : 'border-light bg-light text-muted opacity-50'}`}
                  onClick={() => updateField("isActive", false)}
                >
                  <i className="bi bi-x-circle-fill d-block fs-4 mb-1"></i>
                  <span className="fw-bold small">Inactive</span>
                </div>
              </div>
            </div>

            <hr className="my-4 opacity-10" />

            <div className="d-flex flex-column gap-2">
              <button type="submit" className="btn btn-primary py-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 overflow-hidden position-relative" disabled={loading}>
                {loading ? (
                   <><span className="spinner-border spinner-border-sm" role="status"></span> {SAVING}</>
                ) : (
                  <><i className="bi bi-cloud-arrow-up-fill"></i> <span className="fw-bold">{isEdit ? 'Save Changes' : 'Create User'}</span></>
                )}
              </button>
              <button type="button" className="btn btn-light py-3 rounded-3 text-secondary shadow-none border" onClick={() => router.back()} disabled={loading}>
                Cancel & Return
              </button>
            </div>
          </div>
        </div>
      </form>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .text-indigo { color: #6366f1; }
        .bg-success-light { background-color: #f0fdf4; }
        .bg-danger-light { background-color: #fef2f2; }
        .pointer { cursor: pointer; }
        .transition-all { transition: all 0.3s ease; }
        .focus-shadow:focus {
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
          border-color: #6366f1 !important;
          background-color: white !important;
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
