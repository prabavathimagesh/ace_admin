"use client";
import { useState, useEffect } from "react";
import { BTN_CANCEL, BTN_DELETE, CONFIRM_FIELD_EMAIL, CONFIRM_FIELD_TITLE, DEFAULT_VALUE, LABEL_TYPE, LABEL_TYPE_DELETE, MSG_CONFIRM_DELETE, TITLE_DELETE } from "../../../constants/config-message";

export default function DeleteModal({
  item,
  onClose,
  onConfirm,
  confirmField = DEFAULT_VALUE,
}) {
  const [value, setValue] = useState("");

  if (!item) return null;

  // ---------------------------
  // SPECIAL CASE: ORGANIZATION
  // ---------------------------
  const isOrg = Boolean(item.organizationName);

  // confirmation text (what user must type)
  let target = "";

  if (isOrg) {
    // must type domain email
    target = item.domainEmail;
  } else if (confirmField === CONFIRM_FIELD_TITLE) {
    target = item.title || item.name;
  } else if (confirmField === CONFIRM_FIELD_EMAIL) {
    target = item.email;
  } else {
    target = item[confirmField] || "";
  }

  // item label
  const itemLabel = isOrg
    ? `Organization Name: ${item.organizationName}`
    : `Item: ${item.title ?? item.name ?? ""}`;

  // disable paste for security
  function handleChange(e) {
    setValue(e.target.value);
  }

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title text-danger">{TITLE_DELETE}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <p><b>{itemLabel}</b></p>

            {/* EXTRA LINE only for org */}
            {isOrg && (
              <p className="text-danger mb-1">
                <b>{LABEL_TYPE} : {LABEL_TYPE_DELETE}</b>
              </p>
            )}

            <p className="text-danger">
              {LABEL_TYPE} <b>{target}</b> {MSG_CONFIRM_DELETE}
            </p>

            <input
              className="form-control"
              value={value}
              onChange={handleChange}
              onPaste={(e) => e.preventDefault()}
            />
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              {BTN_CANCEL}
            </button>

            <button
              className="btn btn-danger"
              disabled={value !== target}
              onClick={() => onConfirm(item)}
            >
              {BTN_DELETE}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
