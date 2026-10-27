import { useState } from "react";
import { updateStationFuel } from "../api/stationFuels.js";

export default function AdminFuelRow({ station, fuel, onSaved }) {
  const [status, setStatus] = useState(fuel.status);
  const [currentLiters, setCurrentLiters] = useState(fuel.currentLiters);
  const [price, setPrice] = useState(fuel.price);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const saved = await updateStationFuel(fuel.id, {
        status,
        currentLiters: Number(currentLiters),
        price: Number(price),
      });
      onSaved(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <tr>
      <td>{station.name}</td>
      <td>{fuel.fuelType.name}</td>
      <td>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="LOW">LOW</option>
          <option value="OUT">OUT</option>
        </select>
      </td>
      <td>
        <input
          type="number"
          min="0"
          value={currentLiters}
          onChange={(e) => setCurrentLiters(e.target.value)}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </td>
      <td>
        <button type="button" onClick={save} disabled={busy}>
          Сохранить
        </button>
        {error && <div className="table-error">{error}</div>}
      </td>
    </tr>
  );
}
