"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BTN_BACK,
  CONDITION_CREATE_ORGANIZATION,
  CONDITION_GENERAL,
  CONDITION_UPDATE_ORGANIZATION,
  DEFALT_ADMIN,
  EVENT_CITY,
  EVENT_COUNTRY,
  EVENT_DOMAIN_EMAIL,
  EVENT_STATE,
  MSG_SOMETHING_WENT_WRONG,
  ORGANIZATION_CREATED_SUCCESS,
  ORGANIZATION_UPDATED_SUCCESS,
  SAVING,
  TITEL_ORGANIZATION_CATEGORY,
  TITEL_ORGANIZATION_NAME
} from "../../../../constants/config-message";
import {
  createOrganizationApi,
  updateOrganizationApi,
  fetchSingleOrganizationApi,
} from "../../../../lib/apiClient";

export default function OrganizationFormPage() {
  const router = useRouter();
  const params = useSearchParams();

  const editId = params.get("id");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState({
    organizationName: "",
    domainEmail: "",
    country: "",
    state: "",
    city: "",
    organizationCategory: "",
    website: "",
    profileImage: "",
    isActive: true,
    isVerified: false,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [msg, setMsg] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);

  // =========================
  // LOAD FOR EDIT
  // =========================
  useEffect(() => {
    async function load() {
      if (!isEdit) return;
      setFetching(true);
      try {
        const res = await fetchSingleOrganizationApi(editId);
        const d = res?.data?.data || res?.data;
        if (!d) return;

        setForm({
          organizationName: d.organizationName ?? "",
          domainEmail: d.domainEmail ?? "",
          country: d.country ?? "",
          state: d.state ?? "",
          city: d.city ?? "",
          organizationCategory: d.organizationCategory ?? "",
          website: d.website ?? "",
          profileImage: d.profileImage ?? "",
          isActive: d.isActive ?? true,
          isVerified: d.isVerified ?? false,
        });
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [editId, isEdit]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // =========================
  // SUBMIT
  // =========================
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErrorVisible(false);

    const payload = {
      ...form,
      organizationCategory: form.organizationCategory || CONDITION_GENERAL,
    };

    // password only for create
    if (!isEdit) payload.password = DEFALT_ADMIN;

    try {
      const res = isEdit
        ? await updateOrganizationApi(editId, payload)
        : await createOrganizationApi(payload);

      if (res.status || res.data?.status) {
        setMsg(isEdit ? ORGANIZATION_UPDATED_SUCCESS : ORGANIZATION_CREATED_SUCCESS);
        setTimeout(() => router.push(`/admin/organizations${isEdit ? '/' + editId : ''}`), 1000);
      } else {
        setMsg(res.message || res.data?.message || MSG_SOMETHING_WENT_WRONG);
        setErrorVisible(true);
      }
    } catch (err) {
      setMsg(MSG_SOMETHING_WENT_WRONG);
      setErrorVisible(true);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-lg-5 bg-light min-vh-100">
      <div className="max-w-900 mx-auto">
        {/* HEADER */}
        <div className="d-flex align-items-center mb-4 gap-3">
          <button
            className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
            onClick={() => router.back()}
            style={{ width: '40px', height: '40px' }}
          >
            <i className="bi bi-arrow-left fs-5"></i>
          </button>
          <div>
            <h2 className="fw-black text-dark m-0">
              {isEdit ? 'Update Organization' : 'Create Organization'}
            </h2>
            <p className="text-muted small mb-0">Fill in the details below to manage the organization profile.</p>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        {msg && (
          <div className={`alert ${errorVisible ? 'alert-danger' : 'alert-success'} border-0 shadow-sm rounded-4 mb-4 d-flex align-items-center gap-3 animate-fade-in`}>
            <i className={`bi ${errorVisible ? 'bi-exclamation-octagon' : 'bi-check-circle-fill'} fs-4`}></i>
            <div>{msg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="animate-fade-in">
          <div className="row g-4">
            {/* LEFT COLUMN: IDENTITY & BRANDING */}
            <div className="col-lg-4">
              <div className="bg-white rounded-4 shadow-sm border p-4 text-center sticky-top" style={{ top: '2rem' }}>
                <h6 className="text-secondary fw-bold small text-uppercase mb-4 text-start">Branding</h6>
                
                <div className="position-relative d-inline-block mb-4">
                  <div 
                    className="rounded-circle shadow-md border border-4 border-white overflow-hidden bg-light d-flex align-items-center justify-content-center"
                    style={{ width: '150px', height: '150px' }}
                  >
                    {form.profileImage ? (
                      <img src={form.profileImage} className="w-100 h-100 object-fit-cover" alt="Profile" />
                    ) : (
                      <i className="bi bi-building text-muted display-4"></i>
                    )}
                  </div>
                  <label className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow-sm cursor-pointer" style={{ width: '40px', height: '40px' }}>
                    <i className="bi bi-camera-fill"></i>
                    <input 
                      type="text" 
                      className="d-none" 
                      placeholder="Image URL" 
                      value={form.profileImage}
                      onChange={(e) => updateField("profileImage", e.target.value)}
                    />
                  </label>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">Profile Image URL</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm rounded-3 shadow-none border-light bg-light"
                    placeholder="https://example.com/logo.png"
                    value={form.profileImage}
                    onChange={(e) => updateField("profileImage", e.target.value)}
                  />
                  <div className="form-text x-small text-muted">Enter a direct image link for the logo.</div>
                </div>

                <hr className="my-4" />

                <div className="text-start">
                  <h6 className="text-secondary fw-bold small text-uppercase mb-3">Controls</h6>
                  
                  <div className="form-check form-switch mb-3 p-3 bg-light rounded-4 border">
                    <input 
                      className="form-check-input ms-0 me-3" 
                      type="checkbox" 
                      id="isActiveToggle"
                      checked={form.isActive}
                      onChange={(e) => updateField("isActive", e.target.checked)}
                    />
                    <label className="form-check-label fw-bold text-dark" htmlFor="isActiveToggle">
                      Account Active
                    </label>
                    <div className="form-text small m-0 ms-0">Status of the organization account.</div>
                  </div>

                  <div className="form-check form-switch p-3 bg-light rounded-4 border">
                    <input 
                      className="form-check-input ms-0 me-3" 
                      type="checkbox" 
                      id="isVerifiedToggle"
                      checked={form.isVerified}
                      onChange={(e) => updateField("isVerified", e.target.checked)}
                    />
                    <label className="form-check-label fw-bold text-dark" htmlFor="isVerifiedToggle">
                      Verified Badge
                    </label>
                    <div className="form-text small m-0 ms-0">Show verification checkmark.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: FORM FIELDS */}
            <div className="col-lg-8">
              <div className="bg-white rounded-4 shadow-sm border p-4 mb-4">
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-primary">
                  <i className="bi bi-info-circle me-2"></i> General Information
                </h5>
                
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase">{TITEL_ORGANIZATION_NAME}</label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3 border-light bg-light shadow-none"
                      value={form.organizationName}
                      required
                      placeholder="e.g. Acme Corporation"
                      onChange={(e) => updateField("organizationName", e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">{EVENT_DOMAIN_EMAIL}</label>
                    <input
                      type="email"
                      className="form-control rounded-3 border-light bg-light shadow-none"
                      value={form.domainEmail}
                      required
                      placeholder="contact@organization.com"
                      onChange={(e) => updateField("domainEmail", e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted text-uppercase">{TITEL_ORGANIZATION_CATEGORY}</label>
                    <input
                      className="form-control rounded-3 border-light bg-light shadow-none"
                      value={form.organizationCategory}
                      placeholder="e.g. College / NGO / Company"
                      onChange={(e) => updateField("organizationCategory", e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase">Official Website</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-light text-muted"><i className="bi bi-globe"></i></span>
                      <input
                        className="form-control rounded-3 border-light bg-light shadow-none"
                        value={form.website}
                        placeholder="https://www.example.com"
                        onChange={(e) => updateField("website", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-4 shadow-sm border p-4 mb-4">
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-info">
                  <i className="bi bi-geo-alt me-2"></i> Location Details
                </h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">{EVENT_COUNTRY}</label>
                    <input
                      className="form-control rounded-3 border-light bg-light shadow-none"
                      value={form.country}
                      required
                      placeholder="India"
                      onChange={(e) => updateField("country", e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">{EVENT_STATE}</label>
                    <input
                      className="form-control rounded-3 border-light bg-light shadow-none"
                      value={form.state}
                      required
                      placeholder="Maharashtra"
                      onChange={(e) => updateField("state", e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold small text-muted text-uppercase">{EVENT_CITY}</label>
                    <input
                      className="form-control rounded-3 border-light bg-light shadow-none"
                      value={form.city}
                      required
                      placeholder="Mumbai"
                      onChange={(e) => updateField("city", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="d-flex gap-3 mt-5">
                <button 
                  type="submit" 
                  className="btn btn-primary px-5 py-3 rounded-4 shadow-sm fw-bold flex-grow-1"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <span className="spinner-border spinner-border-sm"></span> {SAVING}
                    </span>
                  ) : (
                    isEdit ? 'Update Changes' : 'Create Organization'
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-light px-4 py-3 rounded-4 border flex-grow-0"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .max-w-900 { max-width: 900px; }
        .fw-black { font-weight: 900; }
        .shadow-md { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .cursor-pointer { cursor: pointer; }
        .x-small { font-size: 0.65rem; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }
        input:focus {
          background-color: #fff !important;
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

