'use client';
import { useEffect, useState } from "react";
import CrudLayout from "./CrudLayout";

import {
  fetchPerksApi,
  createPerkApi,
  updatePerkApi,
  deletePerkApi
} from "@/lib/api/master.api";

export default function Perks() {
  const [data, setData] = useState([]);
  const [perkName, setPerkName] = useState("");
  const [editId, setEditId] = useState(null);

  const loadPerks = async () => {
    const res = await fetchPerksApi();
    console.log("iiiiiiiiiiii",res)
    if (res?.data) {
      setData(res.data);
    }
  };

  useEffect(() => {
    loadPerks();
  }, []);

  const handleSubmit = async () => {
    if (!perkName.trim()) return alert("Perk name required");

    if (editId) {
      await updatePerkApi(editId, { perkName });
    } else {
      await createPerkApi({ perkName });
    }

    setPerkName("");
    setEditId(null);
    loadPerks();
  };

  const handleEdit = (row) => {

    setEditId(row.identity);
    setPerkName(row.perkName);
  };

  const handleDelete = async (identity) => {
    if (!confirm("Delete this perk?")) return;
    await deletePerkApi(identity);
    loadPerks();
  };

  return (
    <CrudLayout title="Perks">
      {/* ADD / EDIT */}
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Perk name"
          value={perkName}
          onChange={(e) => setPerkName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* LIST */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Perk Identity</th>
            <th>Perk Name</th>
            <th width="140">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((row) => (
            <tr key={row.identity}>
              <td>{row.identity}</td>
              <td>{row.perkName}</td>
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
