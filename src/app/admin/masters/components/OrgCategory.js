'use client';
import { useEffect, useState } from "react";
import CrudLayout from "./CrudLayout";

import {
  fetchOrgCategoriesApi,
  createOrgCategoryApi,
  updateOrgCategoryApi,
  deleteOrgCategoryApi
} from "@/lib/api/master.api";

export default function OrgCategory() {
  const [data, setData] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);

  const loadOrgCategories = async () => {
    const res = await fetchOrgCategoriesApi();
    if (res?.data) {
      setData(res.data);
    }
  };

  useEffect(() => {
    loadOrgCategories();
  }, []);

  const handleSubmit = async () => {
    if (!categoryName.trim()) return alert("Category name required");

    if (editId) {
      await updateOrgCategoryApi(editId, { categoryName });
    } else {
      await createOrgCategoryApi({ categoryName });
    }

    setCategoryName("");
    setEditId(null);
    loadOrgCategories();
  };

  const handleEdit = (row) => {
    setEditId(row.identity);
    setCategoryName(row.categoryName);
  };

  const handleDelete = async (identity) => {
    if (!confirm("Delete this org category?")) return;
    await deleteOrgCategoryApi(identity);
    loadOrgCategories();
  };

  return (
    <CrudLayout title="Organization Categories">
      {/* ADD / EDIT */}
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Organization category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* LIST */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Category Name</th>
            <th width="140">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.identity}>
              <td>{row.categoryName}</td>
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
