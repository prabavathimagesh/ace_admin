'use client';
import { useEffect, useState } from 'react';
import CrudLayout from '../CrudLayout';
import {
  fetchCountriesApi,
  fetchStatesByCountryApi,
  createStateApi,
  updateStateApi,
  deleteStateApi
} from '@/lib/api/master.api';

export default function State() {
  const [countries, setCountries] = useState([]);
  const [countryId, setCountryId] = useState('');
  const [states, setStates] = useState([]);

  const [form, setForm] = useState({ name: '', code: '' });
  const [editId, setEditId] = useState(null);

  /* =============================
     LOAD COUNTRIES (AUTO SELECT FIRST)
     ============================= */
  useEffect(() => {
    fetchCountriesApi().then(res => {
      if (res?.data?.status) {
        const list = res.data.data || [];
        setCountries(list);

        if (list.length > 0) {
          setCountryId(list[0].identity); // ⭐ auto select
        }
      }
    });
  }, []);

  /* =============================
     LOAD STATES BY COUNTRY
     ============================= */
  useEffect(() => {
    if (!countryId) return;

    fetchStatesByCountryApi(countryId).then(res => {
      if (res?.data?.status) {
        setStates(res.data.data || []);
      }
    });
  }, [countryId]);

  /* =============================
     CREATE / UPDATE
     ============================= */
  const handleSubmit = async () => {
    if (!countryId) return alert('Country missing');

    if (editId) {
      await updateStateApi(editId, form);
    } else {
      await createStateApi(countryId, form);
    }

    setForm({ name: '', code: '' });
    setEditId(null);

    const res = await fetchStatesByCountryApi(countryId);
    if (res?.data?.status) setStates(res.data.data);
  };

  /* =============================
     DELETE
     ============================= */
  const handleDelete = async (id) => {
    if (!confirm('Delete this state?')) return;
    await deleteStateApi(id);

    const res = await fetchStatesByCountryApi(countryId);
    if (res?.data?.status) setStates(res.data.data);
  };

  return (
    <CrudLayout title="States">
      {/* COUNTRY SELECT */}
      <select
        className="form-select mb-3"
        value={countryId}
        onChange={e => setCountryId(e.target.value)}
      >
        {countries.map(c => (
          <option key={c.identity} value={c.identity}>
            {c.name}
          </option>
        ))}
      </select>

      {/* FORM */}
      <div className="row g-2 mb-3">
        <div className="col">
          <input
            className="form-control"
            placeholder="State name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            placeholder="Code"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
          />
        </div>
        <div className="col">
          <button className="btn btn-primary w-100" onClick={handleSubmit}>
            {editId ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th width="160">Action</th>
          </tr>
        </thead>
        <tbody>
          {states.map(s => (
            <tr key={s.identity}>
              <td>{s.name}</td>
              <td>{s.code}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setEditId(s.identity);
                    setForm({ name: s.name, code: s.code });
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(s.identity)}
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