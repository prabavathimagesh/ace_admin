'use client';
import { useEffect, useState } from "react";
import CrudLayout from "./CrudLayout";

import {
  fetchFaqsApi,
  createFaqApi,
  updateFaqApi,
  deleteFaqApi
} from "@/lib/api/master.api";

export default function FAQ() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [editId, setEditId] = useState(null);

  const loadFaqs = async () => {
    const res = await fetchFaqsApi();
    if (res?.data) {
      setData(res.data);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !subTitle.trim())
      return alert("Title and Subtitle required");

    const payload = { title, subTitle };

    if (editId) {
      await updateFaqApi(editId, payload);
    } else {
      await createFaqApi(payload);
    }

    setTitle("");
    setSubTitle("");
    setEditId(null);
    loadFaqs();
  };

  const handleEdit = (row) => {
    setEditId(row.identity);
    setTitle(row.title);
    setSubTitle(row.subTitle);
  };

  const handleDelete = async (identity) => {
    if (!confirm("Delete this FAQ?")) return;
    await deleteFaqApi(identity);
    loadFaqs();
  };

  return (
    <CrudLayout title="FAQ">
      {/* ADD / EDIT */}
      <div className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Subtitle"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* LIST */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Subtitle</th>
            <th width="140">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.identity}>
              <td>{row.title}</td>
              <td>{row.subTitle}</td>
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
