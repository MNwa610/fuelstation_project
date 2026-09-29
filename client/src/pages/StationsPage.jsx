import { useEffect, useState } from "react";
import { fetchStations } from "../api/stations.js";
import { fuelStatusLabel, fuelTypeLabel } from "../utils/fuelLabels.js";
import "./StationsPage.css";

function statusColor(status) {
  if (status === "AVAILABLE") return "#22c55e";
  if (status === "LOW") return "#eab308";
  return "#ef4444";
}

export default function StationsPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchStations();
        if (!cancelled) {
          setStations(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Неизвестная ошибка");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="page">
        <p className="message">Загрузка заправок…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="message error">{error}</p>
        <p className="hint">Убедитесь, что сервер запущен на порту 3000.</p>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="page">
        <p className="message">Заправок пока нет.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Заправки Москвы</h1>
        <p className="subtitle">Найдено: {stations.length}</p>
      </header>

      <ul className="station-list">
        {stations.map((station) => (
          <li key={station.id} className="station-card">
            <h2>{station.name}</h2>
            <p className="network">{station.network.name}</p>
            <p className="address">{station.address}</p>
            <ul className="fuel-list">
              {station.fuels.map((fuel) => (
                <li key={fuel.id} className="fuel-item">
                  <span
                    className="status-dot"
                    style={{ backgroundColor: statusColor(fuel.status) }}
                    title={fuelStatusLabel(fuel.status)}
                  />
                  <span>
                    {fuelTypeLabel(fuel.fuelType)} — {fuelStatusLabel(fuel.status)}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
