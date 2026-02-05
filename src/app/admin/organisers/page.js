"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchOrganizationsApi } from "@/lib/apiClient";

export default function OrganiserList() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    async function loadOrganizers() {
      try {
        const res = await fetchOrganizationsApi();
        console.log("oooooooo",res)
        if (res.status) {
          setOrganizers(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to load organizers:", err);
      } finally {
        setLoading(false);
      }
    }

    try {
      loadOrganizers();
    } catch (err) {
      console.error("UseEffect error:", err);
    }
  }, []);

  const openAdd = () => {
    try {
      setEditMode(false);
      setModalData({
        organizationName: "",
        domainEmail: "",
        organizationCategory: "",
        country: "",
        state: "",
        city: "",
        isVerified: false,
      });
    } catch (err) {
      console.error("OpenAdd error:", err);
    }
  };

  const openEdit = (org) => {
    try {
      setEditMode(true);
      setModalData(org);
    } catch (err) {
      console.error("OpenEdit error:", err);
    }
  };

  const saveOrganizer = () => {
    try {
      if (editMode) {
        setOrganizers(
          organizers.map((o) =>
            o.identity === modalData.identity ? modalData : o
          )
        );
      } else {
        setOrganizers([
          ...organizers,
          { ...modalData, identity: Date.now() }, // fake ID
        ]);
      }

      setModalData(null);
    } catch (err) {
      console.error("SaveOrganizer error:", err);
    }
  };

  const deleteOrganizer = (id) => {
    try {
      setOrganizers(organizers.filter((o) => o.identity !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <p>Loading organizers...</p>;

  return (
    <div className="container mt-4">
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center">
        <h2>Organizer List</h2>
        <button className="btn btn-success" onClick={openAdd}>
          + Add Organizer
        </button>
      </div>

      {/* ORGANIZER TABLE */}
      <div className="table-responsive mt-3">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Domain Email</th>
              <th>Country</th>
              <th>State</th>
              <th>City</th>
              <th>Verified</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {organizers.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center p-4 text-muted">
                  No organizers found
                </td>
              </tr>
            )}

            {organizers.map((org, index) => (
              <tr key={org.identity}>
                <td>{index + 1}</td>
                <td>{org.organizationName}</td>
                <td>{org.domainEmail}</td>
                <td>{org.country}</td>
                <td>{org.state}</td>
                <td>{org.city}</td>

                <td>
                  {org.isVerified ? (
                    <span className="text-success fw-bold">Verified</span>
                  ) : (
                    <span className="text-danger fw-bold">Not Verified</span>
                  )}
                </td>

                <td className="text-center">
                  <Link
                    href={`/admin/organisers/${org.identity}`}
                    className="btn btn-info btn-sm mx-1"
                  >
                    View Events
                  </Link>

                  <button
                    className="btn btn-primary btn-sm mx-1"
                    onClick={() => {
                      try {
                        openEdit(org);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm mx-1"
                    onClick={() => {
                      try {
                        deleteOrganizer(org.identity);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODAL (ADD / EDIT) */}
      {modalData && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit Organizer" : "Add Organizer"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    try {
                      setModalData(null);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                ></button>
              </div>

              <div className="modal-body">

                {[
                  ["organizationName", "Organization Name"],
                  ["domainEmail", "Domain Email"],
                  ["organizationCategory", "Category"],
                  ["country", "Country"],
                  ["state", "State"],
                  ["city", "City"],
                ].map(([key, label]) => (
                  <input
                    key={key}
                    className="form-control mb-2"
                    placeholder={label}
                    value={modalData[key]}
                    onChange={(e) => {
                      try {
                        setModalData({
                          ...modalData,
                          [key]: e.target.value,
                        });
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  />
                ))}

                <div className="form-check form-switch mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={modalData.isVerified}
                    onChange={(e) => {
                      try {
                        setModalData({
                          ...modalData,
                          isVerified: e.target.checked,
                        });
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  />
                  <label className="form-check-label">Verified</label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    try {
                      setModalData(null);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  Close
                </button>

                <button
                  className="btn btn-success"
                  onClick={() => {
                    try {
                      saveOrganizer();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  Save
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
