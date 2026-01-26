"use client";

import { useEffect, useState } from "react";
import Table from "../../../components/Table";
import DeleteModal from "../../../components/DeleteModal";
import SearchInput from "../../../components/SearchInput";
import { useParams, useRouter } from "next/navigation";

import {
  fetchEventsByOrganizationIdApi,
  deleteEventApi,
} from "../../../../../lib/apiClient";
import { ALL_LC, BTN_BACK, COLUMNS_KEY_EVENT_ACTIONS, COLUMNS_KEY_EVENT_DATA, COLUMNS_KEY_EVENT_ORG_NAME, COLUMNS_KEY_EVENT_TIME, COLUMNS_KEY_MODE, COLUMNS_KEY_SNO, COLUMNS_KEY_STATUS, COLUMNS_KEY_TITLE, CONDITION_ACTIVE, EVENT_ADDRESS, EVENT_CREATED_AT, EVENT_DOMAIN_EMAIL, EVENT_MODE, EVENT_STATUSS, LABELS_ACTIONS, LABELS_DATE, LABELS_EVENT_NAME, LABELS_ORGANIZER, LABELS_PAST, LABELS_S_NO, LABELS_TIME, LABELS_UPCOMING, OFFLINE, ONLINE, PLACEHOLDER_SEARCH, SIDEBAR_EVENTS, TITEL_ORGANIZATION } from "../../../../../constants/config-message";

export default function OrgEvents() {
  const { orgId } = useParams();
  const router = useRouter();

  const [tab, setTab] = useState(ALL_LC);
  const [rows, setRows] = useState([]);
  const [orgInfo, setOrgInfo] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search, setSearch] = useState("");

  async function load() {
    const res = await fetchEventsByOrganizationIdApi(orgId);
    let list = res.data?.data || [];

    // ORG INFO
    if (list.length > 0) setOrgInfo(list[0].org || null);

    // TAB FILTER
    if (tab === ONLINE) list = list.filter((e) => e.mode === ONLINE);
    if (tab === OFFLINE) list = list.filter((e) => e.mode === OFFLINE);
    if (tab === LABELS_UPCOMING)
      list = list.filter((e) => new Date(e.eventDate) >= new Date());
    if (tab === LABELS_PAST)
      list = list.filter((e) => new Date(e.eventDate) < new Date());

    // 🔍 SEARCH
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.mode?.toLowerCase().includes(q) ||
          e.status?.toLowerCase().includes(q)
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
    { key: COLUMNS_KEY_MODE, label: EVENT_MODE },
    { key: COLUMNS_KEY_STATUS, label: EVENT_STATUSS },
    { key: COLUMNS_KEY_EVENT_ORG_NAME, label: LABELS_ORGANIZER },
    { key: COLUMNS_KEY_EVENT_ACTIONS, label: LABELS_ACTIONS },
  ];

  const displayRows = rows.map((item, i) => ({
    ...item,
    sno: i + 1,
    orgName: item?.org?.organizationName ?? "-",
  }));

  return (
    <div className="p-4 shadow-none bg-body-tertiary rounded">
      {/* BACK */}
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => router.back()}
      >
        {BTN_BACK}
      </button>

      {/* ORG INFO */}
      {orgInfo && (
        <div
          className="card shadow-sm p-4 mb-4"
          style={{ borderRadius: "14px" }}
        >
          <div className="d-flex justify-content-between mb-4">
            <h3 className="fw-bold">
              {TITEL_ORGANIZATION} : {orgInfo.organizationName.toUpperCase()}
            </h3>
            <span className="badge bg-dark px-3 py-2 fs-6">
              {orgInfo.organizationCategory?.toUpperCase()}
            </span>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-3 border rounded bg-light">
                <div className="fw-bold small text-secondary">{EVENT_DOMAIN_EMAIL}</div>
                <div className="fw-semibold mt-2">{orgInfo.domainEmail}</div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 border rounded bg-light">
                <div className="fw-bold small text-secondary">{EVENT_ADDRESS}</div>
                <div className="fw-semibold mt-2">
                  {orgInfo.city}, {orgInfo.state}, {orgInfo.country}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 border rounded bg-light">
                <div className="fw-bold small text-secondary">{EVENT_CREATED_AT}</div>
                <div className="fw-semibold mt-2">
                  {new Date(orgInfo.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TITLE */}
      <h2>{SIDEBAR_EVENTS}</h2>

      {/* TABS */}
      <ul className="nav nav-tabs my-3">
        {[ALL_LC, ONLINE, OFFLINE, LABELS_UPCOMING, LABELS_PAST].map((t) => (
          <li key={t} className="nav-item">
            <button
              className={"nav-link " + (tab === t ? CONDITION_ACTIVE : "")}
              onClick={() => setTab(t)}
            >
              {t.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>

      {/* SEARCH */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={PLACEHOLDER_SEARCH}
        />
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
    </div>
  );
}
