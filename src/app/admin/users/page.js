"use client";

import { useState, useEffect } from "react";
import Table from "../components/Table";
import DeleteModal from "../components/DeleteModal";
import SearchInput from "../components/SearchInput";
import { useRouter } from "next/navigation";
import { fetchUsersApi, deleteUserApi } from "../../../lib/apiClient";
import { COLUMNS_KEY_SNO, COLUMNS_KEY_STATUS, CONDITION_ACTIONS, CONDITION_ACTIVE, CONDITION_DELETED, CONDITION_INACTIVE, CONDITION_TRASH, CONFIRM_FIELD_EMAIL, EVENT_EMAIL, EVENT_STATUS, LABELS_ACTIONS, LABELS_ACTIVE, LABELS_DELETED, LABELS_INACTIVE, LABELS_NAME, LABELS_NAME_LC, LABELS_S_NO, PHONE, PHONE_NUMBER, PLACEHOLDER_SEARCH, TITEL_CREATE_USER, TITEL_USERS_LIST } from "../../../constants/config-message";

export default function UsersPage() {
  const [tab, setTab] = useState(LABELS_ACTIVE);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const router = useRouter();

  async function load() {
    const res = await fetchUsersApi();
    let list = res.data?.data.data || [];

    // =====================
    // TAB FILTERS
    // =====================
    if (tab === LABELS_ACTIVE) list = list.filter((u) => u.isActive && !u.isDeleted);

    if (tab === LABELS_INACTIVE)
      list = list.filter((u) => !u.isActive && !u.isDeleted);

    if (tab === CONDITION_TRASH) list = list.filter((u) => u.isDeleted);

    // =====================
    // 🔍 SEARCH FILTER
    // =====================
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          (u.isDeleted
            ? CONDITION_DELETED
            : u.isActive
            ? LABELS_ACTIVE
            : LABELS_INACTIVE
          ).includes(q)
      );
    }

    setRows(list);
  }

  useEffect(() => {
    load();
  }, [tab, search]);

  const columns = [
    { key: COLUMNS_KEY_SNO, label: LABELS_S_NO },
    { key: LABELS_NAME_LC, label: LABELS_NAME },
    { key: CONFIRM_FIELD_EMAIL, label: EVENT_EMAIL },
    { key: PHONE, label: PHONE_NUMBER },
    { key: COLUMNS_KEY_STATUS, label: EVENT_STATUS },
    { key: CONDITION_ACTIONS, label: LABELS_ACTIONS },
  ];

  const displayRows = rows.map((u, index) => ({
    ...u,
    sno: index + 1,
    status: u.isDeleted ? LABELS_DELETED : u.isActive ? LABELS_ACTIVE : LABELS_INACTIVE,
  }));

  return (
    <div className="p-4">
      <h2>{TITEL_USERS_LIST}</h2>
      {/* TABS */}
      <ul className="nav nav-tabs my-3">
        {[CONDITION_ACTIVE, CONDITION_INACTIVE, CONDITION_TRASH].map((t) => (
          <li className="nav-item" key={t}>
            <button
              className={"nav-link " + (tab === t ? LABELS_ACTIVE : "")}
              onClick={() => setTab(t)}
            >
              {t.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>

      {/* 🔍 SEARCH */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={PLACEHOLDER_SEARCH}
        />
        <div className="">
          <button
            className="btn btn-primary"
            onClick={() => router.push("/admin/users/create")}
          >
            + {TITEL_CREATE_USER}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        rows={displayRows}
        onRowClick={(u) => router.push(`/admin/users/${u.identity}`)}
        onEdit={(u) => router.push(`/admin/users/create?id=${u.identity}`)}
        onDelete={(u) => setDeleteItem(u)}
      />

      {/* DELETE MODAL */}
      <DeleteModal
        item={deleteItem}
        confirmField="email"
        onClose={() => setDeleteItem(null)}
        onConfirm={async (item) => {
          await deleteUserApi(item.identity);
          setDeleteItem(null);
          load();
        }}
      />
    </div>
  );
}
