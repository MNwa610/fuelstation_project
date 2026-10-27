import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function AdminRoute({ children }) {
  const { user, ready } = useAuth();

  if (!ready) {
    return <p className="message">Проверка доступа…</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "ADMIN") {
    return <Navigate to="/stations" replace />;
  }
  return children;
}
