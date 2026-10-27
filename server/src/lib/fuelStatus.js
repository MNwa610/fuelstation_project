export function calcFuelStatus(currentLiters, capacityLiters) {
  if (currentLiters <= 0 || capacityLiters <= 0) {
    return "OUT";
  }

  const ratio = currentLiters / capacityLiters;
  if (ratio < 0.15) {
    return "LOW";
  }

  return "AVAILABLE";
}
