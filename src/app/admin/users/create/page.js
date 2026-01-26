"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  createUserApi,
  updateUserApi,
  fetchUserByIdApi,
} from "../../../../lib/apiClient";
import {BTN_BACK, CONDITION_CREATE_USER, CONDITION_EDIT_USER, CONDITION_UPDATES_USER, EMAIL_ADDRESS, EVENT_STATUSS, FULL_NAME, LABELS_ACTIVE, LABELS_INACTIVE, MSG_SOMETHING_WENT_WRONG, PASSWORD, PHONE, SAVING} from "../../../../constants/config-message"

export default function UserFormPage() {
  const router = useRouter();
  const params = useSearchParams();

  const userId = params.get("id");
  const isEdit = Boolean(userId);

  // ============================
  // FORM STATE
  // ============================
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",   
    isActive: true,
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================
  // LOAD USER WHEN EDITING
  // ============================
  useEffect(() => {
    async function loadUser() {
      if (!isEdit) return;

      const res = await fetchUserByIdApi(userId);
      const d = res.data?.data || res.data;

      if (!d) return;

      setForm({
        name: d.name || "",
        email: d.email || "",
        phone: d.phone || "",
        password: "",  
        isActive: d.isActive,
      });
    }

    loadUser();
  }, [isEdit, userId]);

  // UPDATE FIELD
  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ============================
  // SUBMIT FORM
  // ============================
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    // ALWAYS SEND PASSWORD IN PAYLOAD
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      isActive: form.isActive,
      password: form.password, // <--- Important
    };

    let res;

    if (isEdit) {
      res = await updateUserApi(userId, payload);
    } else {
      res = await createUserApi(payload);
    }

    if (res.success) {
      setMsg(isEdit ? CONDITION_CREATE_USER : CONDITION_CREATE_USER);
      setTimeout(() => router.push("/admin/users"), 700);
    } else {
      setMsg(res.message || MSG_SOMETHING_WENT_WRONG);
    }

    setLoading(false);
  }

  // ============================
  // UI FORM
  // ============================
  return (
    <div className="container shadow-none p-3 mb-5 bg-light rounded" style={{ maxWidth: "650px" }}>
      <button className="btn btn-outline-secondary mb-3" onClick={() => router.back()}>
        {BTN_BACK}
      </button>

      <h3 className="fw-bold mb-3">{isEdit ? CONDITION_EDIT_USER : CONDITION_CREATE_USER}</h3>

      {msg && <div className="alert alert-info">{msg}</div>}

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        
        {/* FULL NAME */}
        <div className="mb-3">
          <label className="form-label">{FULL_NAME}</label>
          <input
            type="text"
            className="form-control"
            value={form.name}
            required
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label">{EMAIL_ADDRESS}</label>
          <input
            type="email"
            className="form-control"
            value={form.email}
            required
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>

        {/* PHONE */}
        <div className="mb-3">
          <label className="form-label">{PHONE}</label>
          <input
            type="text"
            className="form-control"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="form-label">{PASSWORD}</label>
          <input
            type="password"
            className="form-control"
            value={form.password}
            required={!isEdit}  //  create → required, edit → optional 
            onChange={(e) => updateField("password", e.target.value)}
          />
        </div>

        {/* STATUS */}
        <div className="mb-3">
          <label className="form-label">{EVENT_STATUSS}</label>
          <select
            className="form-select"
            value={String(form.isActive)}
            onChange={(e) => updateField("isActive", e.target.value === "true")}
          >
            <option value="true">{LABELS_ACTIVE}</option>
            <option value="false">{LABELS_INACTIVE}</option>
          </select>
        </div>

        {/* SUBMIT BUTTON */}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? SAVING : isEdit ? CONDITION_UPDATES_USER : CONDITION_CREATE_USER}
        </button>
      </form>
    </div>
  );
}
