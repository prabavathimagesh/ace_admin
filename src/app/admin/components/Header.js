"use client";
import { useRouter } from "next/navigation";
import { BTN_LOGOUT, TITEL_ADMIN } from "../../../constants/config-message";

export default function Header() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <nav className="navbar navbar-light bg-light border-bottom px-3 d-flex justify-content-between">
      <h4 className="m-0">{TITEL_ADMIN}</h4>

      <div className="dropdown">
        <img
          src="/profile.png"
          className="rounded-circle"
          width="40"
          height="40"
          role="button"
          data-bs-toggle="dropdown"
        />

        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <button className="dropdown-item text-danger" onClick={logout}>
              {BTN_LOGOUT}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
