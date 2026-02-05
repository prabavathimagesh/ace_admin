'use client';
import { useEffect, useState } from "react";
import CrudLayout from "./CrudLayout";

import {
  fetchDepartmentsApi,
  createDepartmentApi,
  updateDepartmentApi,
  deleteDepartmentApi
} from "@/lib/api/master.api";

export default function Department() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const loadDepartments = async () => {
    const res = await fetchDepartmentsApi();
    if (res?.data) {
      setData(res.data);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Department name required");

    if (editId) {
      await updateDepartmentApi(editId, { name });
    } else {
      await createDepartmentApi({ name });
    }

    setName("");
    setEditId(null);
    loadDepartments();
  };

  const handleEdit = (row) => {
    setEditId(row.identity);
    setName(row.name);
  };

  const handleDelete = async (identity) => {
    if (!confirm("Delete this department?")) return;
    await deleteDepartmentApi(identity);
    loadDepartments();
  };

  return (
    <CrudLayout title="Departments">
      {/* ADD / EDIT */}
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Department name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* LIST */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Department Name</th>
            <th width="140">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((row) => (
            <tr key={row.identity}>
              <td>{row.name}</td>
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
