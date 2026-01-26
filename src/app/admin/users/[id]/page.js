"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchUserByIdApi } from "../../../../lib/apiClient";
import { BTN_BACK, CONDITION_BG_SUCCESS, CONDITION_BG_WARNING, EVENT_ATTENDED, EVENT_CREATED_AT, EVENT_EMAIL, EVENT_REGISTERED, EVENT_STATUSS, FULL_NAME, LABELS_ACTIVE, LABELS_INACTIVE, LOADING, TABLE_NO_DATA, TITEL_UPCOMING_EVENTS, USER_DETAILS, USER_EVENT_SUMMARY, USER_IDENTITY } from "../../../../constants/config-message"

export default function UserDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetchUserByIdApi(id);
      setData(res.data?.data || null);
    }
    load();
  }, [id]);

  if (!data) return <p className="p-4">{LOADING}</p>;

  return (
    <div className="container shadow-none p-5 bg-light rounded" style={{ maxWidth: "900px" }}>
      
      {/* BACK */}
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => router.back()}
      >
        {BTN_BACK}
      </button>

      {/* =====================
          USER BASIC INFO
      ===================== */}
      <div className="card shadow-sm p-4 mb-4">
        <h3 className="fw-bold mb-3">{USER_DETAILS}</h3>

        <div className="row g-3">
          <div className="col-md-6">
            <div className="border rounded p-3 bg-light">
              <div className="small text-secondary fw-bold">{FULL_NAME}</div>
              <div className="fw-semibold">{data.name}</div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="border rounded p-3 bg-light">
              <div className="small text-secondary fw-bold">{EVENT_EMAIL}</div>
              <div className="fw-semibold">{data.email}</div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="border rounded p-3 bg-light">
              <div className="small text-secondary fw-bold">{PHONE}</div>
              <div className="fw-semibold">{data.phone || TABLE_NO_DATA}</div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="border rounded p-3 bg-light">
              <div className="small text-secondary fw-bold">{EVENT_STATUSS}</div>
              <span
                className={`badge px-3 py-2 ${
                  data.isActive ? CONDITION_BG_SUCCESS : CONDITION_BG_WARNING
                }`}
              >
                {data.isActive ? LABELS_ACTIVE : LABELS_INACTIVE}
              </span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="border rounded p-3 bg-light">
              <div className="small text-secondary fw-bold">{EVENT_CREATED_AT}</div>
              <div className="fw-semibold">
                {new Date(data.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="border rounded p-3 bg-light">
              <div className="small text-secondary fw-bold">{USER_IDENTITY}</div>
              <div className="fw-semibold text-break">
                {data.identity}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================
          USER EVENT STATS (STATIC FOR NOW)
      ===================== */}
      <div className="card shadow-sm p-4">
        <h4 className="fw-bold mb-3">{USER_EVENT_SUMMARY}</h4>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="border rounded p-4 bg-light text-center">
              <div className="fw-bold text-secondary">
                {EVENT_REGISTERED}
              </div>
              <div className="fs-3 fw-bold text-primary mt-2">
                5
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="border rounded p-4 bg-light text-center">
              <div className="fw-bold text-secondary">
                {EVENT_ATTENDED}
              </div>
              <div className="fs-3 fw-bold text-success mt-2">
                3
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="border rounded p-4 bg-light text-center">
              <div className="fw-bold text-secondary">
                {TITEL_UPCOMING_EVENTS}
              </div>
              <div className="fs-3 fw-bold text-warning mt-2">
                2
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
