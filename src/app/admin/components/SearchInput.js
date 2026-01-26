"use client";

import { PLACEHOLDER_SEARCH } from "../../../constants/config-message";

export default function SearchInput({
  value,
  onChange,
  placeholder = {PLACEHOLDER_SEARCH},
}) {
  return (
    <div className="d-flex justify-content-end">
      <div className="input-group" style={{ maxWidth: "320px" }}>
        
        {/* INPUT */}
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{boxShadow:"none"}}
        />

        {/* ICON ON RIGHT */}
        <span className="input-group-text bg-white">
          🔍
        </span>
      </div>
    </div>
  );
}
