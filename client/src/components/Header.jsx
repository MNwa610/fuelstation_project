import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <Link to="/stations" className="logo">
        FuelStation
      </Link>
      <nav className="nav">
        <NavLink to="/stations">Заправки</NavLink>
        {user?.role === "ADMIN" && <NavLink to="/admin">Админка</NavLink>}
        {user ? (
          <button type="button" className="link-btn" onClick={logout}>
            Выйти
          </button>
        ) : (
          <NavLink to="/login">Войти</NavLink>
        )}
      </nav>
    </header>
  );
}
