'use client';
import { useEffect, useState } from 'react';
import CrudLayout from './CrudLayout';
import EventTypeFormModal from './EventTypeFormModal';

import {
  fetchEventTypesApi,
  createEventTypeApi,
  updateEventTypeApi,
  deleteEventTypeApi
} from '@/lib/api/master.api';

export default function EventType() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const loadData = async () => {
    const res = await fetchEventTypesApi();
    if (res?.data?.status) {
      setData(res.data.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (formData) => {
    await createEventTypeApi(formData);
    setShowModal(false);
    loadData();
  };

  const handleUpdate = async (formData) => {
    await updateEventTypeApi(editRow.identity, formData);
    setEditRow(null);
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (identity) => {
    if (!confirm('Delete this Event Type?')) return;
    await deleteEventTypeApi(identity);
    loadData();
  };

  return (
    <>
      <CrudLayout
        title="Event Types"
        onAdd={() => {
          setEditRow(null);
          setShowModal(true);
        }}
      >
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Color</th>
              <th>Image</th>
              <th width="160">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.identity}>
                <td>{row.name}</td>
                <td>
                  <span
                    style={{
                      background: row.color,
                      color: '#fff',
                      padding: '4px 10px'
                    }}
                  >
                    {row.color}
                  </span>
                </td>
                <td>
                  {row.imageUrl && (
                    <img src={row.imageUrl} width="40" />
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => {
                      setEditRow(row);
                      setShowModal(true);
                    }}
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

      <EventTypeFormModal
        show={showModal}
        initialData={editRow}
        onClose={() => setShowModal(false)}
        onSubmit={editRow ? handleUpdate : handleCreate}
      />
    </>
  );
}