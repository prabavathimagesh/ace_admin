"use client";
import React from "react";
import { BTN_DELETE, BTN_EDIT, BTN_VIEW, CONDITION_ACTIONS, CONDITION_POINTER, DEFAULT_VALUE, NO_DATA_TEXT, TEXT_SNO } from "../../../constants/config-message";

export default function Table({
  columns = [],
  rows = [],
  onRowClick,
  onEdit,
  onDelete,
}) {
  const safe = Array.isArray(rows) ? rows : [];

  return (
    <div className="table-responsive">
      <table className="table table-hover table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {safe.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-3">
                {NO_DATA_TEXT}
              </td>
            </tr>
          ) : (
            safe.map((r, i) => (
              <tr
                key={r.identity || i}
                onClick={() => onRowClick && onRowClick(r)}
                style={{ cursor: onRowClick ? CONDITION_POINTER : DEFAULT_VALUE }}
              >
                {columns.map((c) => {
                  // ACTION BUTTONS
                  if (c.key === CONDITION_ACTIONS) {
                    return (
                      <td key={c.key}>
                        <div className="d-flex justify-content-start gap-2">
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => onRowClick && onRowClick(r)}
                            style={{ cursor: onRowClick ? CONDITION_POINTER : DEFAULT_VALUE }}
                          >
                            {BTN_VIEW}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit && onEdit(r);
                            }}
                          >
                            {BTN_EDIT}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete && onDelete(r);
                            }}
                          >
                            {BTN_DELETE}
                          </button>
                        </div>
                      </td>
                    );
                  }

                  // JSX SUPPORT
                  const cellValue =
                    c.key === TEXT_SNO ? i + 1 : r[c.key];

                  return (
                    <td key={c.key}>
                      {React.isValidElement(cellValue)
                        ? cellValue
                        : cellValue ?? "-"}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
