'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CONDITION_ACTIVE, ROUTER_ADMIN_DASHBOARD, ROUTER_ADMIN_EVENTS, ROUTER_ADMIN_ORGANIZATIONS, ROUTER_ADMIN_USERS, SIDEBAR_DASHBOARD, SIDEBAR_EVENTS, SIDEBAR_ORGANIZATIONS, SIDEBAR_USERS, TITEL_ADMINS } from '../../../constants/config-message';

export default function Sidebar() {
  const pathname = usePathname() || '';
  const active = (p) => pathname.startsWith(p);

  return (
    <nav className="sidebar d-md-block bg-light">
      <div className="p-3">
        <h5>{TITEL_ADMINS}</h5>
        <ul className="nav flex-column">
          <li className="nav-item"><Link className={'nav-link ' + (active(ROUTER_ADMIN_DASHBOARD) ? {CONDITION_ACTIVE} : '')} href={ROUTER_ADMIN_DASHBOARD}>{SIDEBAR_DASHBOARD}</Link></li>
          <li className="nav-item mt-2"><Link className={'nav-link ' + (active(ROUTER_ADMIN_ORGANIZATIONS) ? {CONDITION_ACTIVE} : '')} href={ROUTER_ADMIN_ORGANIZATIONS}>{SIDEBAR_ORGANIZATIONS}</Link></li>
          <li className="nav-item mt-2"><Link className={'nav-link ' + (active(ROUTER_ADMIN_EVENTS) ? {CONDITION_ACTIVE} : '')} href={ROUTER_ADMIN_EVENTS}>{SIDEBAR_EVENTS}</Link></li>
          <li className="nav-item mt-2"><Link className={'nav-link ' + (active(ROUTER_ADMIN_USERS) ? {CONDITION_ACTIVE} : '')} href={ROUTER_ADMIN_USERS}>{SIDEBAR_USERS}</Link></li>
        </ul>
      </div>
    </nav>
  );
}
