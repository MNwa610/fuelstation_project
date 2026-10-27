import { useEffect, useState } from "react";
import { fetchMe } from "../api/auth.js";
import { AuthContext } from "../hooks/useAuth.js";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setReady(true);
      return;
    }

    fetchMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  function setSession(token, nextUser) {
    localStorage.setItem("token", token);
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
