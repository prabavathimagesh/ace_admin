"use client";

import { PLACEHOLDER_SEARCH } from "../../../constants/config-message";

export default function SearchInput({
  value,
  onChange,
  placeholder = PLACEHOLDER_SEARCH,
}) {
  return (
    <div className="input-group shadow-sm border rounded-3 overflow-hidden" style={{ maxWidth: "350px" }}>
      <span className="input-group-text bg-white border-0 ps-3">
        <i className="bi bi-search text-muted"></i>
      </span>
      <input
        type="text"
        className="form-control border-0 py-2 ps-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ boxShadow: "none", fontSize: '0.9rem' }}
      />
      {value && (
        <button 
          className="btn bg-white border-0 text-muted" 
          onClick={() => onChange('')}
          type="button"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  );
}
