"use client";

import { useState, useEffect } from "react";
import Table from "../components/Table";
import DeleteModal from "../components/DeleteModal";
import SearchInput from "../components/SearchInput";
import { useRouter } from "next/navigation";

import {
  fetchEventsApi,
  deleteEventApi,
  updateEventStatusApi,
} from "../../../lib/apiClient";

import {
  ALL_LC,
  APPROVED,
  APPROVED_LC,
  BTN_FILTER,
  COLUMNS_KEY_EVENT_ACTIONS,
  COLUMNS_KEY_EVENT_DATA,
  COLUMNS_KEY_EVENT_MODE_TEXT,
  COLUMNS_KEY_EVENT_ORG_NAME,
  COLUMNS_KEY_EVENT_STATUS_DROPDOWN,
  COLUMNS_KEY_EVENT_TIME,
  COLUMNS_KEY_SNO,
  COLUMNS_KEY_TITLE,
  CONDITION_ACTIONS,
  CONDITION_CREATE_EVENT,
  CONDITION_TEXT_DANGER_FE_SEMIBOLD,
  CONDITION_TEXT_SUCCESS_FE_SEMIBOLD,
  DRAFT,
  DRAFT_LC,
  EVENT_MODE,
  EVENT_STATUS,
  LABELS_ACTIONS,
  LABELS_APPROVED,
  LABELS_DATE,
  LABELS_DRAFT,
  LABELS_EVENT_NAME,
  LABELS_PAST,
  LABELS_PENDING,
  LABELS_PRIVATE,
  LABELS_REJECTED,
  LABELS_S_NO,
  LABELS_TIME,
  LABELS_UPCOMING,
  OFFLINE,
  ONLINE,
  PENDING,
  PENDING_LC,
  PLACEHOLDER_SEARCH,
  PRIVATE,
  PRIVATE_LC,
  REJECTED,
  REJECTED_LC,
  TABLE_NO_DATA,
  TITEL_EVENTS_LIST,
  TITEL_ORGANIZATION,
} from "../../../constants/config-message";

export default function EventsPage() {
  const [tab, setTab] = useState("all");
  const [rows, setRows] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [search, setSearch] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);

  // ✅ STATUS CONFIRM STATE
  const [statusConfirm, setStatusConfirm] = useState(null);
  // { item, newStatus }

  const router = useRouter();

  async function load() {
    const res = await fetchEventsApi();
    let list = res.data?.data || [];

    // =====================
    // TAB FILTERS
    // =====================
    if (tab === APPROVED_LC) list = list.filter((e) => e.status === APPROVED);
    if (tab === PENDING_LC) list = list.filter((e) => e.status === PENDING);
    if (tab === REJECTED_LC) list = list.filter((e) => e.status === REJECTED);
    if (tab === PRIVATE_LC) list = list.filter((e) => e.status === PRIVATE);
    if (tab === DRAFT_LC) list = list.filter((e) => e.status === DRAFT);

    if (tab === ONLINE) list = list.filter((e) => e.mode === ONLINE);
    if (tab === OFFLINE) list = list.filter((e) => e.mode === OFFLINE);

    if (tab === LABELS_UPCOMING)
      list = list.filter((e) => new Date(e.eventDate) >= new Date());
    if (tab === LABELS_PAST)
      list = list.filter((e) => new Date(e.eventDate) < new Date());

    if (start)
      list = list.filter((e) => new Date(e.eventDate) >= new Date(start));
    if (end)
      list = list.filter((e) => new Date(e.eventDate) <= new Date(end));

    // =====================
    // 🔍 SEARCH FILTER
    // =====================
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.status?.toLowerCase().includes(q) ||
          e.mode?.toLowerCase().includes(q) ||
          e.org?.organizationName?.toLowerCase().includes(q)
      );
    }

    setRows(list);
  }

  useEffect(() => {
    load();
  }, [tab, search]);

  const columns = [
    { key: COLUMNS_KEY_SNO, label: LABELS_S_NO },
    { key: COLUMNS_KEY_TITLE, label: LABELS_EVENT_NAME },
    { key: COLUMNS_KEY_EVENT_DATA, label: LABELS_DATE },
    { key: COLUMNS_KEY_EVENT_TIME, label: LABELS_TIME },
    { key: COLUMNS_KEY_EVENT_MODE_TEXT, label: EVENT_MODE },
    { key: COLUMNS_KEY_EVENT_STATUS_DROPDOWN, label: EVENT_STATUS },
    { key: COLUMNS_KEY_EVENT_ORG_NAME, label: TITEL_ORGANIZATION },
    { key: COLUMNS_KEY_EVENT_ACTIONS, label: LABELS_ACTIONS },
  ];

  const displayRows = rows.map((item, index) => ({
    ...item,
    sno: index + 1,

    modeText: (
      <span
        className={
          item.mode === ONLINE
            ? CONDITION_TEXT_SUCCESS_FE_SEMIBOLD
            : CONDITION_TEXT_DANGER_FE_SEMIBOLD
        }
      >
        {item.mode === ONLINE ? ONLINE : OFFLINE}
      </span>
    ),

    // ✅ STATUS DROPDOWN WITH CONFIRM
    statusDropdown: (
      <select
        className="form-select form-select-sm w-auto"
        value={item.status}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) =>
          setStatusConfirm({
            item,
            newStatus: e.target.value,
          })
        }
      >
        <option value={APPROVED}>{LABELS_APPROVED}</option>
        <option value={PENDING}>{LABELS_PENDING}</option>
        <option value={REJECTED}>{LABELS_REJECTED}</option>
        <option value={PRIVATE}>{LABELS_PRIVATE}</option>
        <option value={DRAFT}>{LABELS_DRAFT}</option>
      </select>
    ),

    orgName: item?.org?.organizationName || TABLE_NO_DATA,
  }));

  return (
    <div className="p-4">
      <h2>{TITEL_EVENTS_LIST}</h2>

      {/* DATE FILTER */}
      <div className="d-flex gap-2 my-2">
        <input
          type="date"
          className="form-control"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="date"
          className="form-control"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
        <button className="btn btn-primary" onClick={load}>
          {BTN_FILTER}
        </button>
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs my-3">
        {[
          ALL_LC,
          APPROVED_LC,
          PENDING_LC,
          REJECTED_LC,
          PRIVATE_LC,
          DRAFT_LC,
          ONLINE,
          OFFLINE,
          LABELS_UPCOMING,
          LABELS_PAST,
        ].map((t) => (
          <li key={t} className="nav-item">
            <button
              className={`nav-link ${tab === t ? CONDITION_ACTIONS : ""}`}
              onClick={() => setTab(t)}
            >
              {t.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>

      {/* SEARCH + CREATE */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={PLACEHOLDER_SEARCH}
        />

        <button
          className="btn btn-primary"
          onClick={() => router.push("/admin/events/create")}
        >
          + {CONDITION_CREATE_EVENT}
        </button>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        rows={displayRows}
        onRowClick={(r) =>
          router.push(`/admin/events/${r.orgIdentity}/${r.identity}`)
        }
        onEdit={(r) =>
          router.push(
            `/admin/events/create?id=${r.identity}&orgId=${r.orgIdentity}`
          )
        }
        onDelete={(r) => setDeleteItem(r)}
      />

      {/* DELETE MODAL */}
      <DeleteModal
        item={deleteItem}
        confirmField="title"
        onClose={() => setDeleteItem(null)}
        onConfirm={async (item) => {
          await deleteEventApi(item.orgIdentity, item.identity);
          setDeleteItem(null);
          load();
        }}
      />

      {/* ✅ STATUS CONFIRM MODAL */}
      {statusConfirm && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Confirm Status Change</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setStatusConfirm(null)}
                />
              </div>

              <div className="modal-body">
                <p>
                  Are you sure you want to change the status of
                  <strong> {statusConfirm.item.title}</strong> to
                  <strong> {statusConfirm.newStatus}</strong>?
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setStatusConfirm(null)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    await updateEventStatusApi(
                      statusConfirm.item.identity,
                      statusConfirm.newStatus
                    );
                    setStatusConfirm(null);
                    load();
                  }}
                >
                  Confirm
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
