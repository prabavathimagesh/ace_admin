"use client";

import { useEffect, useState } from "react";
import DashboardChart from "../components/DashboardChart";

import {
  fetchOrganizationsApi,
  fetchEventsApi,
  fetchUsersApi,
} from "../../../lib/apiClient";

import {
  APPROVED,
  CONDITION_BG_LIGHT,
  CONDITION_EVENT,
  CONDITION_OFFLINE,
  CONDITION_ONLINE,
  DRAFT,
  LABELS_ACTIVE,
  LABELS_APPROVED,
  LABELS_DELETED,
  LABELS_DRAFT,
  LABELS_INACTIVE,
  LABELS_PENDING,
  LABELS_REJECTED,
  LABELS_VERIFIED,
  PENDING,
  REJECTED,
  ROLE_ORGANIZATION,
  ROLE_USER,
  SIDEBAR_DASHBOARD,
  SIDEBAR_EVENTS,
  SIDEBAR_ORGANIZATIONS,
  SIDEBAR_USERS,
  TITEL_ACTIVE_ORGANIZATIONS,
  TITEL_ACTIVEUSERS,
  TITEL_DELETED_ORGANIZATIONS,
  TITEL_DELETED_USERS,
  TITEL_INACTIVE_ORGANIZATIONS,
  TITEL_INACTIVE_USERS,
  TITEL_OFFLINE_EVENTS,
  TITEL_ONLINE_EVENTS,
  TITEL_PAST_EVENTS,
  TITEL_REGISTERED_EVENTS,
  TITEL_UPCOMING_EVENTS,
  TITEL_VERIFIED_ORGANIZATIONS,
} from "../../../constants/config-message";

export default function DashboardPage() {
  const [activeView, setActiveView] = useState(ROLE_ORGANIZATION);

  const [orgs, setOrgs] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const o = await fetchOrganizationsApi();
    const e = await fetchEventsApi();
    const u = await fetchUsersApi();
    console.log("======o", o);
    console.log("======e", e);
    console.log("======u", u);

    // ✅ CORRECT VALUE ACCESS
    setOrgs(Array.isArray(o?.data?.data) ? o.data.data : []);
    setEvents(Array.isArray(e?.data?.data) ? e.data.data : []);
    setUsers(Array.isArray(u?.data?.data) ? u.data.data : []);
  }

  // ================= ORG COUNTS =================
  const orgActive = orgs.filter((o) => o.isActive && !o.isDeleted).length;
  const orgInactive = orgs.filter((o) => !o.isActive && !o.isDeleted).length;
  const orgDeleted = orgs.filter((o) => o.isDeleted).length;
  const orgVerified = orgs.filter((o) => o.isVerified).length;

  // ================= EVENT COUNTS =================
  const approved = events.filter((e) => e.status === APPROVED).length;
  const pending = events.filter((e) => e.status === PENDING).length;
  const rejected = events.filter((e) => e.status === REJECTED).length;
  const draft = events.filter((e) => e.status === DRAFT).length;

  const upcoming = events.filter(
    (e) => new Date(e.eventDate) >= new Date()
  ).length;

  const past = events.filter((e) => new Date(e.eventDate) < new Date()).length;

  // ================= USER COUNTS =================
  const userActive = users.filter((u) => u.isActive && !u.isDeleted).length;
  const userInactive = users.filter((u) => !u.isActive && !u.isDeleted).length;
  const userDeleted = users.filter((u) => u.isDeleted).length;

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4">{SIDEBAR_DASHBOARD}</h2>

      {/* TOP BOXES */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div
            className={`p-3 border rounded text-center cursor-pointer ${
              activeView === ROLE_ORGANIZATION && CONDITION_BG_LIGHT
            }`}
            onClick={() => setActiveView(ROLE_ORGANIZATION)}
          >
            <h6>{SIDEBAR_ORGANIZATIONS}</h6>
            <h3>{orgs.length}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className={`p-3 border rounded text-center ${
              activeView === CONDITION_EVENT && CONDITION_BG_LIGHT
            }`}
            onClick={() => setActiveView(CONDITION_EVENT)}
          >
            <h6>{SIDEBAR_EVENTS}</h6>
            <h3>{events.length}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className={`p-3 border rounded text-center ${
              activeView === ROLE_USER && CONDITION_BG_LIGHT
            }`}
            onClick={() => setActiveView(ROLE_USER)}
          >
            <h6>{SIDEBAR_USERS}</h6>
            <h3>{users.length}</h3>
          </div>
        </div>
      </div>

      {/* ================= ORGANIZATION VIEW ================= */}
      {activeView === ROLE_ORGANIZATION && (
        <>
          <DashboardChart
            label="Organizations"
            labels={[
              LABELS_ACTIVE,
              LABELS_INACTIVE,
              LABELS_DELETED,
              LABELS_VERIFIED,
            ]}
            data={[orgActive, orgInactive, orgDeleted, orgVerified]}
          />

          <div className="row mt-4">
            <InfoBox title={TITEL_ACTIVE_ORGANIZATIONS} value={orgActive} />
            <InfoBox title={TITEL_INACTIVE_ORGANIZATIONS} value={orgInactive} />
            <InfoBox title={TITEL_DELETED_ORGANIZATIONS} value={orgDeleted} />
            <InfoBox title={TITEL_VERIFIED_ORGANIZATIONS} value={orgVerified} />
          </div>
        </>
      )}

      {/* ================= EVENT VIEW ================= */}
      {activeView === CONDITION_EVENT && (
        <>
          <DashboardChart
            label={SIDEBAR_EVENTS}
            labels={[
              LABELS_APPROVED,
              LABELS_PENDING,
              LABELS_REJECTED,
              LABELS_DRAFT,
            ]}
            data={[approved, pending, rejected, draft]}
          />

          <div className="row mt-4">
            <InfoBox title={TITEL_UPCOMING_EVENTS} value={upcoming} />
            <InfoBox title={TITEL_PAST_EVENTS} value={past} />
            <InfoBox
              title={TITEL_ONLINE_EVENTS}
              value={events.filter((e) => e.mode === CONDITION_ONLINE).length}
            />
            <InfoBox
              title={TITEL_OFFLINE_EVENTS}
              value={events.filter((e) => e.mode === CONDITION_OFFLINE).length}
            />
          </div>
        </>
      )}

      {/* ================= USER VIEW ================= */}
      {activeView === ROLE_USER && (
        <>
          <DashboardChart
            label={SIDEBAR_USERS}
            labels={[LABELS_ACTIVE, LABELS_INACTIVE, LABELS_DELETED]}
            data={[userActive, userInactive, userDeleted]}
          />

          <div className="row mt-4">
            <InfoBox title={TITEL_ACTIVEUSERS} value={userActive} />
            <InfoBox title={TITEL_INACTIVE_USERS} value={userInactive} />
            <InfoBox title={TITEL_DELETED_USERS} value={userDeleted} />
            <InfoBox title={TITEL_REGISTERED_EVENTS} value={events.length} />
          </div>
        </>
      )}
    </div>
  );
}

function InfoBox({ title, value }) {
  return (
    <div className="col-md-3 mb-3">
      <div className="p-3 bg-light border rounded text-center">
        <div className="small text-muted">{title}</div>
        <div className="fs-4 fw-bold">{value}</div>
      </div>
    </div>
  );
}
