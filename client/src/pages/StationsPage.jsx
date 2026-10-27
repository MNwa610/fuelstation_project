import { useEffect, useMemo, useState } from "react";
import { fetchStations } from "../api/stations.js";
import FilterPanel from "../components/FilterPanel.jsx";
import StationCard from "../components/StationCard.jsx";
import StationsMap from "../components/StationsMap.jsx";
import { filterStations, uniqueFuelTypes } from "../utils/filterStations.js";
import { getCurrentPosition } from "../utils/geo.js";

export default function StationsPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [userPoint, setUserPoint] = useState(null);
  const [locating, setLocating] = useState(false);
  const [filters, setFilters] = useState({
    fuelType: "",
    status: "",
    address: "",
    radiusKm: "",
  });

  useEffect(() => {
    fetchStations()
      .then(setStations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => filterStations(stations, filters, userPoint),
    [stations, filters, userPoint]
  );

  async function locate() {
    setLocating(true);
    setNotice(null);
    try {
      setUserPoint(await getCurrentPosition());
    } catch (e) {
      setNotice(e.message);
    } finally {
      setLocating(false);
    }
  }

  if (loading) return <p className="message">Загрузка заправок…</p>;
  if (error) return <p className="message error">{error}</p>;

  return (
    <div className="page">
      <h1>Заправки Москвы</h1>
      <p className="subtitle">Найдено: {filtered.length}</p>
      {notice && <p className="message error">{notice}</p>}
      <FilterPanel
        fuelTypes={uniqueFuelTypes(stations)}
        filters={filters}
        onChange={setFilters}
        onLocate={locate}
        locating={locating}
      />
      <StationsMap stations={filtered} userPoint={userPoint} />
      <ul className="station-list">
        {filtered.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </ul>
    </div>
  );
}
