import { API_URL } from "./config.js";

export async function fetchStations() {
  const response = await fetch(`${API_URL}/api/v1/stations`);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`);
  }
  return response.json();
}

export async function fetchStation(id) {
  const response = await fetch(`${API_URL}/api/v1/stations/${id}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Заправка не найдена");
  }
  return data;
}
