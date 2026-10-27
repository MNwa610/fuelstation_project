import { Link } from "react-router-dom";
import { fuelStatusLabel, fuelTypeLabel } from "../utils/fuelLabels.js";

function statusColor(status) {
  if (status === "AVAILABLE") return "#22c55e";
  if (status === "LOW") return "#eab308";
  return "#ef4444";
}

export default function StationCard({ station }) {
  return (
    <li className="station-card">
      <Link to={`/stations/${station.id}`}>
        <h2>{station.name}</h2>
      </Link>
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
  );
}
