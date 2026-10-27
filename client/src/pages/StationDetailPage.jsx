import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchStation } from "../api/stations.js";
import { fuelStatusLabel, fuelTypeLabel } from "../utils/fuelLabels.js";

export default function StationDetailPage() {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStation(id).then(setStation).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="message error">{error}</p>;
  if (!station) return <p className="message">Загрузка…</p>;

  const routeUrl = `https://yandex.ru/maps/?rtext=~${station.lat},${station.lng}&rtt=auto`;

  return (
    <div className="page">
      <h1>{station.name}</h1>
      <p className="network">{station.network.name}</p>
      <p className="address">{station.address}</p>
      {station.phone && <p>Телефон: {station.phone}</p>}
      <a className="btn" href={routeUrl} target="_blank" rel="noreferrer">
        Проложить маршрут
      </a>
      <h2>Топливо</h2>
      <ul className="fuel-detail-list">
        {station.fuels.map((fuel) => (
          <li key={fuel.id} className="fuel-detail">
            <strong>{fuelTypeLabel(fuel.fuelType)}</strong>
            <span>Цена: {fuel.price.toFixed(2)} ₽</span>
            <span>
              Остаток: {Math.round(fuel.currentLiters)} / {Math.round(fuel.capacityLiters)} л
            </span>
            <span>Статус: {fuelStatusLabel(fuel.status)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
