"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {BTN_BACK, CONDITION_CREATE_ORGANIZATION, CONDITION_GENERAL, CONDITION_UPDATE_ORGANIZATION, DEFALT_ADMIN, EVENT_CITY, EVENT_COUNTRY, EVENT_DOMAIN_EMAIL, EVENT_STATE, MSG_SOMETHING_WENT_WRONG, ORGANIZATION_CREATED_SUCCESS, ORGANIZATION_UPDATED_SUCCESS, SAVING, TITEL_ORGANIZATION_CATEGORY, TITEL_ORGANIZATION_NAME} from "../../../../constants/config-message"
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
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // =========================
  // LOAD FOR EDIT
  // =========================
  useEffect(() => {
    async function load() {
      if (!isEdit) return;

      const res = await fetchSingleOrganizationApi(editId);
      const d = res?.data?.data;
      if (!d) return;

      setForm({
        organizationName: d.organizationName ?? "",
        domainEmail: d.domainEmail ?? "",
        country: d.country ?? "",
        state: d.state ?? "",
        city: d.city ?? "",
        organizationCategory: d.organizationCategory ?? "",
      });
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

    const payload = {
      organizationName: form.organizationName,
      domainEmail: form.domainEmail,
      country: form.country,
      state: form.state,
      city: form.city,
      organizationCategory: form.organizationCategory || CONDITION_GENERAL,
    };

    // password only for create
    if (!isEdit) payload.password = DEFALT_ADMIN;

    const res = isEdit
      ? await updateOrganizationApi(editId, payload)
      : await createOrganizationApi(payload);

    if (res.success) {
      setMsg(isEdit ? ORGANIZATION_UPDATED_SUCCESS : ORGANIZATION_CREATED_SUCCESS);
      setTimeout(() => router.push("/admin/organizations"), 800);
    } else {
      setMsg(res.message || MSG_SOMETHING_WENT_WRONG);
    }

    setLoading(false);
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="container shadow-none p-5 bg-light rounded" style={{ maxWidth: "1000px" }}>
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => router.back()}
      >
        {BTN_BACK}
      </button>

      <h3 className="fw-bold mb-4">
        {isEdit ? CONDITION_UPDATE_ORGANIZATION : CONDITION_CREATE_ORGANIZATION}
      </h3>

      {msg && <div className="alert alert-info">{msg}</div>}

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="row g-3">

          {/* ORGANIZATION NAME */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">{TITEL_ORGANIZATION_NAME}</label>
            <input
              type="text"
              className="form-control"
              value={form.organizationName}
              required
              onChange={(e) => updateField("organizationName", e.target.value)}
            />
          </div>

          {/* DOMAIN EMAIL */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">{EVENT_DOMAIN_EMAIL}</label>
            <input
              type="email"
              className="form-control"
              value={form.domainEmail}
              required
              onChange={(e) => updateField("domainEmail", e.target.value)}
            />
          </div>

          {/* COUNTRY */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">{EVENT_COUNTRY}</label>
            <input
              className="form-control"
              value={form.country}
              required
              onChange={(e) => updateField("country", e.target.value)}
            />
          </div>

          {/* STATE */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">{EVENT_STATE}</label>
            <input
              className="form-control"
              value={form.state}
              required
              onChange={(e) => updateField("state", e.target.value)}
            />
          </div>

          {/* CITY */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">{EVENT_CITY}</label>
            <input
              className="form-control"
              value={form.city}
              required
              onChange={(e) => updateField("city", e.target.value)}
            />
          </div>

          {/* CATEGORY */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">{TITEL_ORGANIZATION_CATEGORY}</label>
            <input
              className="form-control"
              value={form.organizationCategory}
              placeholder="e.g. College / NGO / Company"
              onChange={(e) =>
                updateField("organizationCategory", e.target.value)
              }
            />
          </div>

          {/* SUBMIT */}
          <div className="col-12 mt-3">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading
                ? SAVING
                : isEdit
                ? CONDITION_UPDATE_ORGANIZATION
                : CONDITION_CREATE_ORGANIZATION}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
