import { API_URL, authHeaders } from "./config.js";

export async function register(payload) {
  const response = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Ошибка регистрации");
  }
  return data;
}

export async function login(payload) {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Ошибка входа");
  }
  return data;
}

export async function fetchMe() {
  const response = await fetch(`${API_URL}/api/v1/auth/me`, {
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Ошибка профиля");
  }
  return data;
}
