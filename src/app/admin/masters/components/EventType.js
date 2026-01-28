'use client';
import { useEffect, useState } from 'react';
import CrudLayout from './CrudLayout';
import EventTypeFormModal from './EventTypeFormModal';

import {
  fetchMasterListApi,
  createMasterApi,
  updateMasterApi,
  deleteMasterApi,
  MASTER_PATHS
} from '@/lib/api/master.api';

export default function EventType() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const loadData = async () => {
    const res = await fetchMasterListApi(MASTER_PATHS.EVENT_TYPE);
    if (res?.data) {
      setData(res.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (payload) => {
    await createMasterApi(MASTER_PATHS.EVENT_TYPE, payload);
    setShowModal(false);
    loadData();
  };

  const handleUpdate = async (payload) => {
    await updateMasterApi(
      MASTER_PATHS.EVENT_TYPE,
      editRow.identity,
      payload
    );
    setEditRow(null);
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (identity) => {
    if (!confirm('Delete this Event Type?')) return;
    await deleteMasterApi(MASTER_PATHS.EVENT_TYPE, identity);
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
                      padding: '4px 12px',
                      color: '#fff'
                    }}
                  >
                    {row.color}
                  </span>
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
