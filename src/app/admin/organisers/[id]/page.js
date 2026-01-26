"use client";

import { fetchEventsByOrganizationIdApi } from "@/lib/apiClient";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Past event checker
function isPast(date) {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    return new Date(date).setHours(0, 0, 0, 0) < today;
  } catch (err) {
    console.error("Date check error:", err);
    return false;
  }
}

export default function OrganizerEvents() {
  const { id } = useParams();
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchEventsByOrganizationIdApi(id);
        setEvents(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to load organizer events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    try {
      load();
    } catch (err) {
      console.error("UseEffect error:", err);
    }
  }, [id]);

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center">
        <h2>Events — Organizer ({id})</h2>

        <button
          className="btn btn-secondary"
          onClick={() => {
            try {
              router.push("/admin/organisers");
            } catch (err) {
              console.error("Navigation error:", err);
            }
          }}
        >
          Back
        </button>
      </div>

      {/* ---------- POPUP ---------- */}
      {popup && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">{popup.title}</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    try {
                      setPopup(null);
                    } catch (err) {
                      console.error("Close popup error:", err);
                    }
                  }}
                ></button>
              </div>

              <div className="modal-body">
                <p><strong>Organizer:</strong> {popup.org.organizationName}</p>
                <p><strong>Venue:</strong> {popup.venue || "Offline"}</p>
                <p><strong>Date:</strong> {popup.eventDate}</p>
                <p><strong>Time:</strong> {popup.eventTime}</p>
                <p><strong>Mode:</strong> {popup.mode}</p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    try {
                      setPopup(null);
                    } catch (err) {
                      console.error("Close popup error:", err);
                    }
                  }}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ---------- TABLE ---------- */}
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped table-hover">

          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Event Name</th>
              <th>Organizer</th>
              <th>Venue</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {events.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-muted">
                  No events found
                </td>
              </tr>
            )}

            {events.map((ev, index) => (
              <tr
                key={ev.identity}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  try {
                    setPopup(ev);
                  } catch (err) {
                    console.error("Popup open error:", err);
                  }
                }}
              >
                <td>{index + 1}</td>
                <td>{ev.title}</td>
                <td>{ev.org.organizationName}</td>
                <td>{ev.venue || "Offline"}</td>
                <td>{ev.eventDate}</td>
                <td>{ev.eventTime}</td>

                <td
                  className="fw-bold"
                  onClick={(e) => {
                    try {
                      e.stopPropagation();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  {isPast(ev.eventDate) ? (
                    <span className="text-danger">Finished</span>
                  ) : (
                    <span className="text-success">Upcoming</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
