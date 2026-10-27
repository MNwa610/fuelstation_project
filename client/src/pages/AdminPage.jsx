import { useEffect, useState } from "react";
import { fetchStations } from "../api/stations.js";
import AdminFuelRow from "../components/AdminFuelRow.jsx";

export default function AdminPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStations()
      .then(setStations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function onSaved(saved) {
    setStations((prev) =>
      prev.map((station) => ({
        ...station,
        fuels: station.fuels.map((fuel) =>
          fuel.id === saved.id ? { ...fuel, ...saved } : fuel
        ),
      }))
    );
  }

  if (loading) return <p className="message">Загрузка…</p>;
  if (error) return <p className="message error">{error}</p>;

  return (
    <div className="page wide">
      <h1>Админка</h1>
      <p className="subtitle">Остаток и цена. Статус считается по литрам.</p>
      <table className="admin-table">
        <thead>
          <tr>
            <th>АЗС</th>
            <th>Топливо</th>
            <th>Статус</th>
            <th>Литры</th>
            <th>Цена</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {stations.flatMap((station) =>
            station.fuels.map((fuel) => (
              <AdminFuelRow
                key={fuel.id}
                station={station}
                fuel={fuel}
                onSaved={onSaved}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
