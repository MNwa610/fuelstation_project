export default function FilterPanel({
  fuelTypes,
  filters,
  onChange,
  onLocate,
  locating,
}) {
  function setField(name, value) {
    onChange({ ...filters, [name]: value });
  }

  return (
    <form className="filters" onSubmit={(e) => e.preventDefault()}>
      <select
        value={filters.fuelType}
        onChange={(e) => setField("fuelType", e.target.value)}
      >
        <option value="">Все виды топлива</option>
        {fuelTypes.map((ft) => (
          <option key={ft.code} value={ft.code}>
            {ft.name}
          </option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={(e) => setField("status", e.target.value)}
      >
        <option value="">Любой статус</option>
        <option value="AVAILABLE">В наличии</option>
        <option value="LOW">Заканчивается</option>
        <option value="OUT">Нет в наличии</option>
      </select>
      <input
        placeholder="Адрес"
        value={filters.address}
        onChange={(e) => setField("address", e.target.value)}
      />
      <input
        type="number"
        min="0"
        placeholder="Радиус, км"
        value={filters.radiusKm}
        onChange={(e) => setField("radiusKm", e.target.value)}
      />
      <button type="button" onClick={onLocate} disabled={locating}>
        {locating ? "Определяем…" : "Моё местоположение"}
      </button>
    </form>
  );
}
