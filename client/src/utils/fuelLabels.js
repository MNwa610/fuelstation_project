const STATUS_LABELS = {
  AVAILABLE: "В наличии",
  LOW: "Заканчивается",
  OUT: "Нет в наличии",
};

export function fuelStatusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function fuelTypeLabel(fuelType) {
  return fuelType.name || fuelType.code;
}
