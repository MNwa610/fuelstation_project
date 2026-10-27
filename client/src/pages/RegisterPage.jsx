import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../api/auth.js";
import { useAuth } from "../hooks/useAuth.js";

export default function RegisterPage() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await register({ fullName, email, password });
      const data = await login({ email, password });
      setSession(data.token, data.user);
      navigate("/stations");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page narrow">
      <h1>Регистрация</h1>
      <form className="form" onSubmit={onSubmit}>
        <input
          placeholder="Имя"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль (от 6 символов)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        {error && <p className="message error">{error}</p>}
        <button type="submit">Создать аккаунт</button>
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}
