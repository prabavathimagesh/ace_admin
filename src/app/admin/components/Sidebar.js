"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CONDITION_ACTIVE,
  ROUTER_ADMIN_DASHBOARD,
  ROUTER_ADMIN_EVENTS,
  ROUTER_ADMIN_ORGANIZATIONS,
  ROUTER_ADMIN_USERS,
  SIDEBAR_DASHBOARD,
  SIDEBAR_EVENTS,
  SIDEBAR_ORGANIZATIONS,
  SIDEBAR_USERS,
  TITEL_ADMINS,
} from "../../../constants/config-message";

export default function Sidebar() {
  const pathname = usePathname() || "";
  const active = (p) => pathname.startsWith(p);

  const menuItems = [
    { href: ROUTER_ADMIN_DASHBOARD, label: SIDEBAR_DASHBOARD, icon: "bi-grid-1x2" },
    { href: ROUTER_ADMIN_ORGANIZATIONS, label: SIDEBAR_ORGANIZATIONS, icon: "bi-building" },
    { href: ROUTER_ADMIN_EVENTS, label: SIDEBAR_EVENTS, icon: "bi-calendar-event" },
    { href: ROUTER_ADMIN_USERS, label: SIDEBAR_USERS, icon: "bi-people" },
    { href: "/admin/masters", label: "Masters", icon: "bi-gear" },
  ];

  return (
    <nav className="sidebar bg-white">
      <div className="p-4">
        <div className="d-flex align-items-center mb-4 ps-2">
          <div className="bg-primary bg-gradient rounded-3 p-2 me-2">
            <i className="bi bi-shield-lock-fill text-white fs-5"></i>
          </div>
          <h5 className="mb-0 fw-bold text-dark">{TITEL_ADMINS}</h5>
        </div>
        
        <ul className="nav flex-column gap-1">
          {menuItems.map((item) => (
            <li key={item.href} className="nav-item">
              <Link
                href={item.href}
                className={
                  "nav-link d-flex align-items-center px-3 py-2 rounded-2 " +
                  (active(item.href) 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-secondary hover-bg-light")
                }
                style={{ transition: 'all 0.2s' }}
              >
                <i className={`bi ${item.icon} me-3 fs-5`}></i>
                <span className="fw-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .hover-bg-light:hover {
          background-color: #f3f4f6;
          color: #111827 !important;
        }
      `}</style>
    </nav>
  );
}
