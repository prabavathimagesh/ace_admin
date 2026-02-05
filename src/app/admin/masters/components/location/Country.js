'use client';
import { useEffect, useState } from 'react';
import CrudLayout from '../CrudLayout';
import {
  fetchCountriesApi,
  createCountryApi,
  updateCountryApi,
  deleteCountryApi
} from '@/lib/api/master.api';

export default function Country() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ name: '', code: '', phoneCode: '' });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await fetchCountriesApi();
    if (res?.data?.status) setData(res.data.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (editId) {
      await updateCountryApi(editId, form);
    } else {
      await createCountryApi(form);
    }
    setForm({ name: '', code: '', phoneCode: '' });
    setEditId(null);
    load();
  };

  return (
    <CrudLayout title="Countries">
      <div className="row g-2 mb-3">
        <div className="col"><input className="form-control" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div className="col"><input className="form-control" placeholder="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
        <div className="col"><input className="form-control" placeholder="Phone Code" value={form.phoneCode} onChange={e => setForm({ ...form, phoneCode: e.target.value })} /></div>
        <div className="col"><button className="btn btn-primary" onClick={submit}>{editId ? 'Update' : 'Add'}</button></div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th><th>Code</th><th>Phone</th><th width="160">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map(c => (
            <tr key={c.identity}>
              <td>{c.name}</td>
              <td>{c.code}</td>
              <td>{c.phoneCode}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => {
                  setEditId(c.identity);
                  setForm({ name: c.name, code: c.code, phoneCode: c.phoneCode });
                }}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => {
                  if (confirm('Delete?')) deleteCountryApi(c.identity).then(load);
                }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CrudLayout>
  );
}