"use client";

import { BTN_NEXT, CONDITION_ACTIVE, CONDITION_DISABLED, LABEL_TEXT } from "../../../constants/config-message";

export default function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1 || isNaN(totalPages) || !isFinite(totalPages)) return null;

  return (
    <nav className="mt-4">
      <ul className="pagination justify-content-center border-0">
        {/* PREV */}
        <li className={`page-item mx-1 ${page === 1 ? CONDITION_DISABLED : ""}`}>
          <button 
            className="page-link rounded-3 border-0 bg-white shadow-sm" 
            onClick={() => onChange(page - 1)}
            disabled={page === 1}
          >
            <i className="bi bi-chevron-left"></i> {LABEL_TEXT}
          </button>
        </li>

        {/* PAGE NUMBERS */}
        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          // Only show 5 pages around current or similar logic if needed, 
          // but for now keeping it simple as it was.
          return (
            <li key={p} className={`page-item mx-1 ${page === p ? 'active' : ""}`}>
              <button 
                className={`page-link rounded-3 border-0 shadow-sm ${page === p ? 'bg-primary text-white' : 'bg-white text-dark'}`} 
                onClick={() => onChange(p)}
              >
                {p}
              </button>
            </li>
          );
        })}

        {/* NEXT */}
        <li className={`page-item mx-1 ${page === totalPages ? CONDITION_DISABLED : ""}`}>
          <button 
            className="page-link rounded-3 border-0 bg-white shadow-sm" 
            onClick={() => onChange(page + 1)}
            disabled={page === totalPages}
          >
            {BTN_NEXT} <i className="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
}
