"use client";

import { useEffect, useState } from "react";
import Table from "../components/Table";
import DeleteModal from "../components/DeleteModal";
import SearchInput from "../components/SearchInput";
import { useRouter } from "next/navigation";

import {
  fetchOrganizationsApi,
  deleteOrganizationApi,
} from "../../../lib/apiClient";
import { COLUMNS_KEY_DOMAIN_EMAIL, COLUMNS_KEY_EVENT_ACTIONS, COLUMNS_KEY_ORGANIZATION_NAME, COLUMNS_KEY_SNO, CONDITION_ACTIVE, CONDITION_CREATE_ORGANIZATION, CONDITION_INACTIVE, CONDITION_TRASH, EVENT_CITY, EVENT_CITY_LC, EVENT_COUNTRY, EVENT_EMAIL, LABELS_ACTIONS, LABELS_NAME, LABELS_S_NO, PLACEHOLDER_SEARCH, ROUTER_ADMIN_ORGANIZATIONS_CREATE, TITEL_ORGANIZATION_LIST ,EVENT_COUNTRY_LC} from "../../../constants/config-message";

export default function OrganizationPage() {
  const [tab, setTab] = useState(CONDITION_ACTIVE);
  const [rows, setRows] = useState([]);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search, setSearch] = useState("");

  const router = useRouter();

  async function load() {
    const res = await fetchOrganizationsApi();
    let list = res.data?.data || [];

    // TAB FILTER
    if (tab === CONDITION_ACTIVE) list = list.filter((o) => o.isActive && !o.isDeleted);
    if (tab === CONDITION_INACTIVE)
      list = list.filter((o) => !o.isActive && !o.isDeleted);
    if (tab === CONDITION_TRASH) list = list.filter((o) => o.isDeleted);

    // 🔍 SEARCH FILTER
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (Organization) =>
          Organization.organizationName?.toLowerCase().includes(q) ||
          Organization.domainEmail?.toLowerCase().includes(q) ||
          Organization.city?.toLowerCase().includes(q) ||
          Organization.country?.toLowerCase().includes(q)
      );
    }

    setRows(list);
  }

  useEffect(() => {
    load();
  }, [tab, search]);

  const columns = [
    { key: COLUMNS_KEY_SNO, label: LABELS_S_NO },
    { key: COLUMNS_KEY_ORGANIZATION_NAME, label: LABELS_NAME },
    { key: COLUMNS_KEY_DOMAIN_EMAIL, label: EVENT_EMAIL },
    { key: EVENT_CITY_LC, label: EVENT_CITY },
    { key: EVENT_COUNTRY_LC, label: EVENT_COUNTRY },
    { key: COLUMNS_KEY_EVENT_ACTIONS, label: LABELS_ACTIONS },
  ];

  return (
    <div className="p-4">
      <h2>{TITEL_ORGANIZATION_LIST}</h2>

      {/* TABS */}
      <ul className="nav nav-tabs my-3">
        {[CONDITION_ACTIVE, CONDITION_INACTIVE, CONDITION_TRASH].map((t) => (
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

      {/* CREATE */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={PLACEHOLDER_SEARCH}
        />
        <button
          className="btn btn-primary"
          onClick={() => router.push(ROUTER_ADMIN_ORGANIZATIONS_CREATE)}
        >
          + {CONDITION_CREATE_ORGANIZATION}
        </button>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        rows={rows}
        onRowClick={(r) =>
          router.push(`/admin/organizations/${r.identity}/events`)
        }
        onEdit={(r) =>
          router.push(`/admin/organizations/create?id=${r.identity}`)
        }
        onDelete={(r) => setDeleteItem(r)}
      />

      {/* DELETE MODAL */}
      <DeleteModal
        item={deleteItem}
        confirmField={COLUMNS_KEY_ORGANIZATION_NAME}
        onClose={() => setDeleteItem(null)}
        onConfirm={async (item) => {
          await deleteOrganizationApi(item.identity);
          setDeleteItem(null);
          load();
        }}
      />
    </div>
  );
}
