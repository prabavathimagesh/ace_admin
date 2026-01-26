"use client";

import { BTN_NEXT, CONDITION_ACTIVE, CONDITION_DISABLED, LABEL_TEXT } from "../../../constants/config-message";

export default function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-3">
      <ul className="pagination justify-content-center">
        {/* PREV */}
        <li className={`page-item ${page === 1 ? CONDITION_DISABLED : ""}`}>
          <button className="page-link" onClick={() => onChange(page - 1)}>
            {LABEL_TEXT}
          </button>
        </li>

        {/* PAGE NUMBERS */}
        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          return (
            <li key={p} className={`page-item ${page === p ? CONDITION_ACTIVE : ""}`}>
              <button className="page-link" onClick={() => onChange(p)}>
                {p}
              </button>
            </li>
          );
        })}

        {/* NEXT */}
        <li className={`page-item ${page === totalPages ? CONDITION_DISABLED : ""}`}>
          <button className="page-link" onClick={() => onChange(page + 1)}>
            {BTN_NEXT}
          </button>
        </li>
      </ul>
    </nav>
  );
}
