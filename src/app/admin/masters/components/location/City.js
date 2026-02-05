'use client';
import { useEffect, useState } from 'react';
import CrudLayout from '../CrudLayout';
import {
  fetchCountriesApi,
  fetchStatesByCountryApi,
  fetchCitiesByStateApi,
  createCityApi,
  updateCityApi,
  deleteCityApi
} from '@/lib/api/master.api';

export default function City() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');

  const [name, setName] = useState('');
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
          setCountryId(list[0].identity); // ⭐ auto select country
        }
      }
    });
  }, []);

  /* =============================
     LOAD STATES (AUTO SELECT FIRST)
     ============================= */
  useEffect(() => {
    if (!countryId) return;

    fetchStatesByCountryApi(countryId).then(res => {
      if (res?.data?.status) {
        const list = res.data.data || [];
        setStates(list);

        if (list.length > 0) {
          setStateId(list[0].identity); // ⭐ auto select state
        }
      }
    });
  }, [countryId]);

  /* =============================
     LOAD CITIES
     ============================= */
  useEffect(() => {
    if (!stateId) return;

    fetchCitiesByStateApi(stateId).then(res => {
      if (res?.data?.status) {
        setCities(res.data.data || []);
      }
    });
  }, [stateId]);

  /* =============================
     CREATE / UPDATE
     ============================= */
  const handleSubmit = async () => {
    if (!stateId) return alert('State missing');

    if (editId) {
      await updateCityApi(editId, { name });
    } else {
      await createCityApi(stateId, { name });
    }

    setName('');
    setEditId(null);

    const res = await fetchCitiesByStateApi(stateId);
    if (res?.data?.status) setCities(res.data.data);
  };

  /* =============================
     DELETE
     ============================= */
  const handleDelete = async (id) => {
    if (!confirm('Delete this city?')) return;
    await deleteCityApi(id);

    const res = await fetchCitiesByStateApi(stateId);
    if (res?.data?.status) setCities(res.data.data);
  };

  return (
    <CrudLayout title="Cities">
      {/* COUNTRY */}
      <select
        className="form-select mb-2"
        value={countryId}
        onChange={e => setCountryId(e.target.value)}
      >
        {countries.map(c => (
          <option key={c.identity} value={c.identity}>
            {c.name}
          </option>
        ))}
      </select>

      {/* STATE */}
      <select
        className="form-select mb-3"
        value={stateId}
        onChange={e => setStateId(e.target.value)}
      >
        {states.map(s => (
          <option key={s.identity} value={s.identity}>
            {s.name}
          </option>
        ))}
      </select>

      {/* FORM */}
      <div className="row g-2 mb-3">
        <div className="col">
          <input
            className="form-control"
            placeholder="City name"
            value={name}
            onChange={e => setName(e.target.value)}
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
            <th width="160">Action</th>
          </tr>
        </thead>
        <tbody>
          {cities.map(c => (
            <tr key={c.identity}>
              <td>{c.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setEditId(c.identity);
                    setName(c.name);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(c.identity)}
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