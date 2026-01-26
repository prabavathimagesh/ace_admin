"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminGetEventByIdApi } from "../../../../../lib/apiClient";
import {APPROVED, BTN_BACK, CONDITION_BG_DANGER, CONDITION_BG_SUCCESS, CONDITION_BG_WARNING, EVENT_ADDRESS, EVENT_CREATED_AT, EVENT_DATE, EVENT_DESCRIPTION, EVENT_DETAILS, EVENT_EMAIL, EVENT_MODE, EVENT_NAME, EVENT_NO_BANNER_IMAGE, EVENT_NO_DESCRIPTION_PROVIDED, EVENT_NO_VENUE, EVENT_STATUSS, EVENT_TIME, EVENT_VENU_NAME, LABELS_ACTIVE, LABELS_INACTIVE, LOADING, TABLE_NO_DATA } from "../../../../../constants/config-message"

export default function SingleEventPage() {
  const { orgId, eventId } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await adminGetEventByIdApi(orgId, eventId);
      setData(res.data?.data || null);
    }
    load();
  }, [orgId, eventId]);

  if (!data) return <p className="p-4">{LOADING}</p>;

  const org = data.org || {};

  console.log("llllllllll",org)

  return (
    <div className="container py-4 shadow-none bg-body-tertiary rounded" style={{ maxWidth: "1050px" }}>
      {/* BACK BUTTON */}
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => router.back()}
      >
        {BTN_BACK}
      </button>

      {/* ORGANIZATION PANEL */}
      <div className="p-4 rounded shadow-sm mb-4 bg-white border">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold m-0">Oranization Info</h3>

          {org.organizationCategory && (
            <span className="badge bg-dark px-3 py-2 fs-6">
              {org.organizationCategory.toUpperCase()}
            </span>
          )}
        </div>

        <div className="row g-3">
          {/* EMAIL */}
          <div className="col-md-4">
            <div className="small text-secondary fw-bold">{EVENT_EMAIL}</div>
            <div className="fw-semibold">{org.organizationName || TABLE_NO_DATA}</div>
          </div>

          {/* ADDRESS */}
          <div className="col-md-4">
            <div className="small text-secondary fw-bold">{EVENT_ADDRESS}</div>
            <div className="fw-semibold">
              {org.city || TABLE_NO_DATA}, {org.state || TABLE_NO_DATA}, {org.country || TABLE_NO_DATA}
            </div>
          </div>

          {/* STATUS */}
          <div className="col-md-4">
            <div className="small text-secondary fw-bold">{EVENT_STATUSS}</div>
            <span
              className={`badge px-3 py-2 fs-6 ${
                org.isActive ? CONDITION_BG_SUCCESS : CONDITION_BG_DANGER
              }`}
            >
              {org.isActive ? LABELS_ACTIVE : LABELS_INACTIVE}
            </span>
          </div>
        </div>
      </div>

      {/* ============================
          DETAILS + BANNER (SIDE-BY-SIDE)
      ============================ */}
      <h4 className="fw-bold mb-5">{EVENT_DETAILS}</h4>
      <div className="row g-4 ">
        {/* LEFT SIDE — EVENT DETAILS */}
        <div className="col-md-7 py-3">
          <div className="p-4 rounded shadow-sm bg-white border">
            {/* GRID OF SMALL BOXES */}
            <div className="row g-3">
              <h6 className="mb-4">{EVENT_NAME}: {data.title.toUpperCase()}</h6>
              <div className="col-md-6">
                <div className="border rounded p-3 bg-light overflow-hidden">
                  <div className="small fw-bold text-secondary">{EVENT_VENU_NAME}</div>
                  <div
                    className="fw-semibold text-wrap text-break"
                    style={{ wordBreak: "break-word" }}
                  >
                    {data.venue || EVENT_NO_VENUE}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3 bg-light overflow-hidden">
                  <div className="small fw-bold text-secondary">{EVENT_MODE}</div>
                  <div
                    className="fw-semibold text-wrap text-break"
                    style={{ wordBreak: "break-word" }}
                  >
                    {data.mode}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3 bg-light overflow-hidden">
                  <div className="small fw-bold text-secondary">{EVENT_DATE}</div>
                  <div
                    className="fw-semibold text-wrap text-break"
                    style={{ wordBreak: "break-word" }}
                  >
                    {data.eventDate}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3 bg-light overflow-hidden">
                  <div className="small fw-bold text-secondary">{EVENT_TIME}</div>
                  <div
                    className="fw-semibold text-wrap text-break"
                    style={{ wordBreak: "break-word" }}
                  >
                    {data.eventTime}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3 bg-light overflow-hidden">
                  <div className="small fw-bold text-secondary">{EVENT_CREATED_AT}</div>
                  <div
                    className="fw-semibold text-wrap text-break"
                    style={{ wordBreak: "break-word" }}
                  >
                    {data.createdAt}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3 bg-light overflow-hidden">
                  <div className="small fw-bold text-secondary">{EVENT_STATUSS}</div>
                  <span
                    className={
                      "badge px-3 py-2 " +
                      (data.status === APPROVED ? CONDITION_BG_SUCCESS : CONDITION_BG_WARNING)
                    }
                  >
                    {data.status}
                  </span>
                </div>
              </div>

              <div className="col-md-12">
                <div className="border rounded p-3 bg-light overflow-hidden">
                  <div className="small fw-bold text-secondary">
                    {EVENT_DESCRIPTION}
                  </div>
                  <div
                    className="fw-semibold text-wrap text-break"
                    style={{ wordBreak: "break-word" }}
                  >
                    {data.description || EVENT_NO_DESCRIPTION_PROVIDED}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — BANNER IMAGE */}
        <div className="col-md-5 py-3">
          <div className="rounded shadow-sm overflow-hidden border bg-white">
            {data.bannerImage ? (
              <img
                src={data.bannerImage}
                className="img-fluid w-100"
                style={{ height: "350px", objectFit: "contain" }}
              />
            ) : (
              <div className="p-5 text-center text-muted">{EVENT_NO_BANNER_IMAGE}</div>
            )}
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
    </div>
  );
}
