"use client";
import React from "react";
import { BTN_DELETE, BTN_EDIT, BTN_VIEW, CONDITION_ACTIONS, CONDITION_POINTER, DEFAULT_VALUE, NO_DATA_TEXT, TEXT_SNO } from "../../../constants/config-message";

export default function Table({
  columns = [],
  rows = [],
  onRowClick,
  onEdit,
  onDelete,
  sortConfig = { key: null, direction: 'asc' },
  onSort,
}) {
  const safe = Array.isArray(rows) ? rows : [];

  return (
    <div className="custom-table-container">
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              {columns.map((c) => (
                <th 
                  key={c.key} 
                  onClick={() => c.sortable !== false && onSort && onSort(c.key)}
                  style={{ cursor: c.sortable !== false && onSort ? 'pointer' : 'default' }}
                  className="user-select-none"
                >
                  <div className="d-flex align-items-center">
                    {c.label}
                    {c.sortable !== false && onSort && (
                      <span className={`sort-icon ${sortConfig.key === c.key ? 'sort-active' : ''}`}>
                        {sortConfig.key === c.key ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {safe.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-5">
                  <div className="text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    {NO_DATA_TEXT}
                  </div>
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
                        <td key={c.key} onClick={(e) => e.stopPropagation()}>
                          <div className="d-flex justify-content-start gap-2">
                            <button
                              className="btn btn-sm btn-outline-success border-0 bg-light"
                              onClick={() => onRowClick && onRowClick(r)}
                              title={BTN_VIEW}
                            >
                              <i className="bi bi-eye"></i> {BTN_VIEW}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary border-0 bg-light"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit && onEdit(r);
                              }}
                              title={BTN_EDIT}
                            >
                              <i className="bi bi-pencil"></i> {BTN_EDIT}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger border-0 bg-light"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete && onDelete(r);
                              }}
                              title={BTN_DELETE}
                            >
                              <i className="bi bi-trash"></i> {BTN_DELETE}
                            </button>
                          </div>
                        </td>
                      );
                    }

                    // JSX SUPPORT
                    const cellValue =
                      c.key === TEXT_SNO ? (r[TEXT_SNO] || i + 1) : r[c.key];

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
    </div>
  );
}
