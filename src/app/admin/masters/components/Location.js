'use client';
import { useState } from 'react';
import Country from './location/Country';
import State from './location/State';
import City from './location/City';

export default function Location() {
  const [tab, setTab] = useState('country');

  return (
    <>
      <ul className="nav nav-tabs">
        {['country', 'state', 'city'].map(t => (
          <li className="nav-item" key={t}>
            <button
              className={`nav-link ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        {tab === 'country' && <Country />}
        {tab === 'state' && <State />}
        {tab === 'city' && <City />}
      </div>
    </>
  );
}