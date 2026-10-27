import { API_URL, authHeaders } from "./config.js";

export async function updateStationFuel(id, payload) {
  const response = await fetch(`${API_URL}/api/v1/station-fuels/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Ошибка сохранения");
  }
  return data;
}

export async function fetchFuelEvents(id) {
  const response = await fetch(`${API_URL}/api/v1/station-fuels/${id}/events`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Ошибка загрузки событий");
  }
  return data;
}
