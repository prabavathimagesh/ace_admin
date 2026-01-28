'use client';
import { useEffect, useState } from "react";
import CrudLayout from "./CrudLayout";

import {
  fetchAccommodationsApi,
  createAccommodationApi,
  updateAccommodationApi,
  deleteAccommodationApi
} from "@/lib/api/master.api";

export default function Accommodation() {
  const [data, setData] = useState([]);
  const [accommodationName, setAccommodationName] = useState("");
  const [editId, setEditId] = useState(null);

  const loadAccommodations = async () => {
    const res = await fetchAccommodationsApi();
    if (res?.data) {
      setData(res.data);
    }
  };

  useEffect(() => {
    loadAccommodations();
  }, []);

  const handleSubmit = async () => {
    if (!accommodationName.trim()) return alert("Accommodation name required");

    if (editId) {
      await updateAccommodationApi(editId, { accommodationName });
    } else {
      await createAccommodationApi({ accommodationName });
    }

    setAccommodationName("");
    setEditId(null);
    loadAccommodations();
  };

  const handleEdit = (row) => {
    setEditId(row.identity);
    setAccommodationName(row.accommodationName);
  };

  const handleDelete = async (identity) => {
    if (!confirm("Delete this accommodation?")) return;
    await deleteAccommodationApi(identity);
    loadAccommodations();
  };

  return (
    <CrudLayout title="Accommodation">
      {/* ADD / EDIT */}
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Accommodation name"
          value={accommodationName}
          onChange={(e) => setAccommodationName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* LIST */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Accommodation Name</th>
            <th width="140">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((row) => (
            <tr key={row.identity}>
              <td>{row.accommodationName}</td>
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
