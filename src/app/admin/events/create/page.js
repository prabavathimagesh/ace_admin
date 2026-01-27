"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createEventApi,
  updateEventApi,
  adminGetEventByIdApi,
  fetchOrganizationsApi,
} from "../../../../lib/apiClient";
import {BTN_BACK, CONDITION_CREATE_EVENT, CONDITION_EDIT_EVENT, CONDITION_UPDATE_EVENT, EVENT_CREATED_SUCCESS, EVENT_DATE, EVENT_DESCRIPTION, EVENT_MODE, EVENT_TIME, EVENT_TITLE, EVENT_UPDATED_SUCCESS, EVENT_VENU_NAME, MSG_SELECT_ORGANIZATION, MSG_SOMETHING_WENT_WRONG, OFFLINE, ONLINE, ROUTER_ADMIN_EVENTS, SAVING, TITEL_ORGANIZATION} from "../../../../constants/config-message"

export default function EventFormPage() {
  const router = useRouter();
  const params = useSearchParams();

  const eventId = params.get("id");
  const orgIdFromUrl = params.get("orgId");
  const isEdit = Boolean(eventId);

  const [organizations, setOrganizations] = useState([]);

  const [form, setForm] = useState({
    event_title: "",
    description: "",
    event_date: "",
    event_time: "",
    venue: "",
    mode: OFFLINE,
    orgId: orgIdFromUrl || "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // LOAD ORGANIZATIONS
  useEffect(() => {
    async function loadOrganizations() {
      const res = await fetchOrganizationsApi();
      setOrganizations(res.data?.data || []);
    }
    loadOrganizations();
  }, []);

  // LOAD EVENT (EDIT)
  useEffect(() => {
    async function loadEvent() {
      if (!isEdit) return;

      const res = await adminGetEventByIdApi(orgIdFromUrl, eventId);
      const d = res.data?.data;
      if (!d) return;

      setForm({
        event_title: d.title || "",
        description: d.description || "",
        event_date: d.eventDate || "",
        event_time: d.eventTime || "",
        venue: d.venue || "",
        mode: d.mode || OFFLINE,
        orgId: d.orgIdentity || orgIdFromUrl,
      });
    }
    loadEvent();
  }, [isEdit, eventId, orgIdFromUrl]);

  // SUBMIT
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const payload = {
      event_title: form.event_title,
      description: form.description,
      event_date: form.event_date,
      event_time: form.event_time,
      venue: form.venue,
      mode: form.mode,
    };

    const res = isEdit
      ? await updateEventApi(form.orgId, eventId, payload)
      : await createEventApi(form.orgId, payload);

    if (res.status) {
      setMsg(isEdit ? EVENT_UPDATED_SUCCESS : EVENT_CREATED_SUCCESS);
      setTimeout(() => router.push(ROUTER_ADMIN_EVENTS), 700);
    } else {
      setMsg(res.message || MSG_SOMETHING_WENT_WRONG);
    }

    setLoading(false);
  }

  return (
    <div className="container shadow-none p-5 mb-5 bg-light rounded" style={{ maxWidth: "1000px" }}>
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => router.back()}
      >
        {BTN_BACK}
      </button>

      <h3 className="fw-bold mb-4">
        {isEdit ? CONDITION_EDIT_EVENT : CONDITION_CREATE_EVENT}
      </h3>

      {msg && <div className="alert alert-info">{msg}</div>}

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="row g-3">

          {/* ORGANIZATION */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">{TITEL_ORGANIZATION}</label>
            <select
              className="form-select"
              value={form.orgId}
              required
              onChange={(e) => updateField("orgId", e.target.value)}
            >
              <option value="">{MSG_SELECT_ORGANIZATION}</option>
              {organizations.map((org) => (
                <option key={org.identity} value={org.identity}>
                  {org.organizationName}
                </option>
              ))}
            </select>
          </div>

          {/* EVENT TITLE */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">{EVENT_TITLE}</label>
            <input
              type="text"
              className="form-control"
              value={form.event_title}
              required
              onChange={(e) => updateField("event_title", e.target.value)}
            />
          </div>

          {/* DATE */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">{EVENT_DATE}</label>
            <input
              type="date"
              className="form-control"
              value={form.event_date}
              required
              onChange={(e) => updateField("event_date", e.target.value)}
            />
          </div>

          {/* TIME */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">{EVENT_TIME}</label>
            <input
              type="time"
              className="form-control"
              value={form.event_time}
              required
              onChange={(e) => updateField("event_time", e.target.value)}
            />
          </div>

          {/* VENUE */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">{EVENT_VENU_NAME}</label>
            <input
              type="text"
              className="form-control"
              value={form.venue}
              onChange={(e) => updateField("venue", e.target.value)}
            />
          </div>

          {/* MODE */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">{EVENT_MODE}</label>
            <select
              className="form-select"
              value={form.mode}
              onChange={(e) => updateField("mode", e.target.value)}
            >
              <option value={ONLINE}>{ONLINE}</option>
              <option value={OFFLINE}>{OFFLINE}</option>
            </select>
          </div>

          {/* DESCRIPTION – FULL WIDTH */}
          <div className="col-12">
            <label className="form-label fw-semibold">{EVENT_DESCRIPTION}</label>
            <textarea
              className="form-control"
              rows="4"
              value={form.description}
              required
              onChange={(e) => updateField("description", e.target.value)}
            ></textarea>
          </div>

          {/* SUBMIT */}
          <div className="col-12">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading
                ? SAVING
                : isEdit
                ? CONDITION_UPDATE_EVENT
                : CONDITION_CREATE_EVENT}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
