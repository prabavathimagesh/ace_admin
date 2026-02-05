'use client';
import { useEffect, useState } from "react";
import CrudLayout from "./CrudLayout";

import {
  fetchCertificationsApi,
  createCertificationApi,
  updateCertificationApi,
  deleteCertificationApi
} from "@/lib/api/master.api";

export default function Certification() {
  const [data, setData] = useState([]);
  const [certName, setCertName] = useState("");
  const [editId, setEditId] = useState(null);

  const loadCertifications = async () => {
    const res = await fetchCertificationsApi();
    if (res?.data) {
      setData(res.data);
    }
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  const handleSubmit = async () => {
    if (!certName.trim()) return alert("Certification name required");

    if (editId) {
      await updateCertificationApi(editId, { certName });
    } else {
      await createCertificationApi({ certName });
    }

    setCertName("");
    setEditId(null);
    loadCertifications();
  };

  const handleEdit = (row) => {
    setEditId(row.identity);
    setCertName(row.certName);
  };

  const handleDelete = async (identity) => {
    if (!confirm("Delete this certification?")) return;
    await deleteCertificationApi(identity);
    loadCertifications();
  };

  return (
    <CrudLayout title="Certification">
      {/* ADD / EDIT */}
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Certification name"
          value={certName}
          onChange={(e) => setCertName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* LIST */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Certification Name</th>
            <th width="140">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((row) => (
            <tr key={row.identity}>
              <td>{row.certName}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(row)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(row.identity)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CrudLayout>
  );
}
