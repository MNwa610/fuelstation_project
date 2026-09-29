const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function fetchStations() {
  const response = await fetch(`${API_URL}/api/v1/stations`);

  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`);
  }

  return response.json();
}
